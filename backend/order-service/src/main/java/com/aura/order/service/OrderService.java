package com.aura.order.service;

import com.aura.order.event.OrderPlacedEvent;
import com.aura.order.model.Coupon;
import com.aura.order.model.Order;
import com.aura.order.model.OrderItem;
import com.aura.order.repository.CouponRepository;
import com.aura.order.repository.OrderRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public Order createOrder(Long userId, OrderRequest request) {
        double subtotal = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();
        
        Order order = Order.builder()
                .userId(userId)
                .orderDate(Instant.now())
                .status("PENDING")
                .shippingAddress(request.getShippingAddress())
                .billingAddress(request.getBillingAddress() != null ? request.getBillingAddress() : request.getShippingAddress())
                .paymentMethod(request.getPaymentMethod())
                .couponCode(request.getCouponCode())
                .trackingNumber("AURA-SHP-" + String.format("%09d", new Random().nextInt(1000000000)))
                .build();

        for (OrderItemRequest item : request.getItems()) {
            // Synchronous check & stock deduction from product-service
            try {
                String productBaseUrl = System.getenv().getOrDefault("PRODUCT_SERVICE_URL", "http://localhost:8082");
                String productServiceUrl = productBaseUrl + "/api/products/" + item.getProductId();
                // Load details
                Map<?, ?> prodMap = restTemplate.getForObject(productServiceUrl, Map.class);
                if (prodMap == null) throw new RuntimeException("Target product not found in catalog.");

                String name = (String) prodMap.get("name");
                double price = (Double) prodMap.get("price");
                double discount = (Double) prodMap.get("discountPercentage");
                double discPrice = price * (1.0 - (discount / 100.0));

                // Deduct stock in Product Service
                restTemplate.put(productServiceUrl + "/stock?quantity=" + item.getQuantity(), null);

                OrderItem orderItem = OrderItem.builder()
                        .productId(item.getProductId())
                        .productName(name)
                        .quantity(item.getQuantity())
                        .price(discPrice)
                        .order(order)
                        .build();

                orderItems.add(orderItem);
                subtotal += discPrice * item.getQuantity();

            } catch (Exception e) {
                throw new RuntimeException("Inventory validation failed: " + e.getMessage());
            }
        }

        order.setOrderItems(orderItems);
        order.setSubtotal(subtotal);

        // Apply coupon code if provided
        double discountAmount = 0.0;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Optional<Coupon> couponOpt = couponRepository.findByCode(request.getCouponCode().toUpperCase().trim());
            if (couponOpt.isPresent()) {
                Coupon coupon = couponOpt.get();
                if (coupon.isActive() && coupon.getExpiryDate().isAfter(Instant.now())) {
                    if (coupon.getDiscountAmount() > 0) {
                        discountAmount = Math.min(subtotal, coupon.getDiscountAmount());
                    } else if (coupon.getDiscountPercentage() > 0) {
                        discountAmount = subtotal * (coupon.getDiscountPercentage() / 100.0);
                    }
                }
            }
        }

        // Apply loyalty rewards points discount mapping if requested (simulated loyalty deduction)
        if (request.isUseLoyaltyPoints()) {
            // Deduct $10 for every 100 points
            double loyaltyDiscount = 10.0; // Simulated flat rate
            discountAmount = Math.min(subtotal, discountAmount + loyaltyDiscount);
        }

        order.setDiscount(discountAmount);
        
        double taxable = Math.max(0, subtotal - discountAmount);
        double tax = taxable * 0.10; // 10% tax
        order.setTax(tax);
        order.setFinalAmount(taxable + tax);

        Order savedOrder = orderRepository.save(order);

        // Emit Kafka Checkout placed event
        OrderPlacedEvent event = OrderPlacedEvent.builder()
                .orderId(savedOrder.getId())
                .userId(savedOrder.getUserId())
                .finalAmount(savedOrder.getFinalAmount())
                .timestamp(System.currentTimeMillis())
                .build();
        try {
            kafkaTemplate.send("order-events", savedOrder.getId().toString(), event);
        } catch (Exception e) {
            System.err.println("Kafka broker unavailable, skipping order notification stream: " + e.getMessage());
        }

        return savedOrder;
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order transaction log not found."));
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Transactional
    public Order updateOrderStatus(Long id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order transaction log not found."));
        order.setStatus(status.toUpperCase());
        return orderRepository.save(order);
    }

    // Dynamic event-driven communication: Listen for payment settled triggers from payment-service!
    @KafkaListener(topics = "payment-events", groupId = "order-group")
    public void listenPaymentSettled(Map<String, Object> payload) {
        try {
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            String eventType = payload.get("type").toString();
            
            if ("PAYMENT_SUCCESS".equals(eventType)) {
                updateOrderStatus(orderId, "PAID");
                System.out.println("==================================================================");
                System.out.println("KAFKA CONSUMER: PAYMENT AUTHORIZED SETTLED FOR ORDER #" + orderId);
                System.out.println("ORDER STATUS UPDATED TO PAID.");
                System.out.println("==================================================================");
            }
        } catch (Exception e) {
            System.err.println("Failed to process payment event callback: " + e.getMessage());
        }
    }

    // Inner Request Formats
    @Data
    public static class OrderRequest {
        private List<OrderItemRequest> items;
        private String shippingAddress;
        private String billingAddress;
        private String paymentMethod;
        private String couponCode;
        private boolean useLoyaltyPoints;
    }

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private int quantity;
    }
}
