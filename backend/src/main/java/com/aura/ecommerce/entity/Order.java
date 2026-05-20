package com.aura.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "tax_amount")
    private Double taxAmount = 0.0;

    @Column(name = "final_amount", nullable = false)
    private Double finalAmount;

    @Column(nullable = false)
    private String status = "PENDING"; // "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"

    @Column(name = "shipping_address", nullable = false, length = 1000)
    private String shippingAddress;

    @Column(name = "billing_address", nullable = false, length = 1000)
    private String billingAddress;

    @Column(name = "payment_method")
    private String paymentMethod; // "CREDIT_CARD", "PAYPAL", "LOYALTY_POINTS"

    @Column(name = "payment_status")
    private String paymentStatus = "PENDING"; // "PENDING", "COMPLETED", "FAILED"

    @Column(name = "tracking_number")
    private String trackingNumber;

    @Column(name = "coupon_code")
    private String couponCode;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
}
