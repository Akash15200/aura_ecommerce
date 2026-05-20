package com.aura.ecommerce.service;

import com.aura.ecommerce.dto.OrderItemRequest;
import com.aura.ecommerce.dto.OrderRequest;
import com.aura.ecommerce.entity.Coupon;
import com.aura.ecommerce.entity.Order;
import com.aura.ecommerce.entity.OrderItem;
import com.aura.ecommerce.entity.Product;
import com.aura.ecommerce.entity.User;
import com.aura.ecommerce.exception.ResourceNotFoundException;
import com.aura.ecommerce.repository.CouponRepository;
import com.aura.ecommerce.repository.OrderRepository;
import com.aura.ecommerce.repository.ProductRepository;
import com.aura.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    private static final double TAX_RATE = 0.10; // 10% Standard sales tax
    private static final double LOYALTY_POINT_VALUE = 0.10; // Each loyalty point is worth $0.10

    // ==========================================
    // 1. CREATE CUSTOMER ORDER TRANSACTION
    // ==========================================
    @Transactional
    public Order createOrder(OrderRequest request, User user) {
        double subtotal = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress())
                .paymentMethod(request.getPaymentMethod())
                .orderDate(LocalDateTime.now())
                .status("PENDING")
                .paymentStatus("PENDING")
                .build();

        // 1. Validate items and update inventory
        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + itemReq.getProductId()));

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new IllegalArgumentException("Insufficient inventory for product: " + product.getName() + 
                        " (Available: " + product.getStockQuantity() + ")");
            }

            // Deduct stock quantity
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            // Compute line price after product-level discounts
            double discountPrice = product.getPrice() * (1 - (product.getDiscountPercentage() / 100.0));
            subtotal += discountPrice * itemReq.getQuantity();

            OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .price(discountPrice)
                    .build();

            orderItems.add(item);
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(subtotal);

        // 2. Validate and apply coupon discount
        double discount = 0.0;
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode().toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Active coupon not found matching: " + request.getCouponCode()));

            if (!coupon.getIsActive() || coupon.getExpiryDate().isBefore(LocalDateTime.now())) {
                throw new IllegalArgumentException("Coupon is expired or inactive.");
            }

            if (coupon.getTimesUsed() >= coupon.getUsageLimit()) {
                throw new IllegalArgumentException("Coupon usage limit exceeded.");
            }

            if (subtotal < coupon.getMinOrderAmount()) {
                throw new IllegalArgumentException("Order total does not meet the minimum amount required for coupon: $" + coupon.getMinOrderAmount());
            }

            if (coupon.getDiscountAmount() > 0) {
                discount = coupon.getDiscountAmount();
            } else if (coupon.getDiscountPercentage() > 0) {
                discount = subtotal * (coupon.getDiscountPercentage() / 100.0);
            }

            coupon.setTimesUsed(coupon.getTimesUsed() + 1);
            couponRepository.save(coupon);
            order.setCouponCode(coupon.getCode());
        }

        // 3. Redeem loyalty points
        if (request.getUseLoyaltyPoints() && user.getLoyaltyPoints() > 0) {
            double remainingAmount = subtotal - discount;
            double pointsWorth = user.getLoyaltyPoints() * LOYALTY_POINT_VALUE;

            if (pointsWorth >= remainingAmount) {
                // Points cover the entire remaining checkout total
                int pointsUsed = (int) Math.ceil(remainingAmount / LOYALTY_POINT_VALUE);
                discount += remainingAmount;
                user.setLoyaltyPoints(user.getLoyaltyPoints() - pointsUsed);
            } else {
                // Points subtract a partial amount
                discount += pointsWorth;
                user.setLoyaltyPoints(0);
            }
        }

        order.setDiscountAmount(discount);

        // 4. Calculate dynamic tax
        double taxableAmount = Math.max(0.0, subtotal - discount);
        double tax = taxableAmount * TAX_RATE;
        order.setTaxAmount(tax);

        // 5. Calculate final total
        double finalTotal = taxableAmount + tax;
        order.setFinalAmount(finalTotal);

        // 6. Accumulate new loyalty points (Earn 5% of final spent value in loyalty rewards!)
        int newlyEarnedPoints = (int) (finalTotal * 0.05 * 10); // e.g. Spent $100 -> earn $5 value -> 50 points
        user.setLoyaltyPoints(user.getLoyaltyPoints() + newlyEarnedPoints);
        userRepository.save(user);

        // 7. Establish dynamic delivery tracking code
        order.setTrackingNumber("AURA-SHP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setPaymentStatus("COMPLETED"); // Simulated payment authorization success!

        return orderRepository.save(order);
    }

    // ==========================================
    // 2. FETCH ORDER RECORDS
    // ==========================================
    public List<Order> getOrdersForUser(User user) {
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
    }

    public List<Order> getAllOrdersForAdmin() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order details not found for ID: " + id));
    }

    // ==========================================
    // 3. ADMIN WORKFLOW OPERATIONS
    // ==========================================
    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order record not found with ID: " + orderId));

        String upperStatus = status.toUpperCase();
        if (!List.of("PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED").contains(upperStatus)) {
            throw new IllegalArgumentException("Invalid order delivery status argument: " + status);
        }

        // Restock inventory items if order is cancelled
        if (upperStatus.equals("CANCELLED") && !order.getStatus().equals("CANCELLED")) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
            order.setPaymentStatus("REFUNDED");
        }

        order.setStatus(upperStatus);
        return orderRepository.save(order);
    }
}
