package com.aura.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "discount_amount")
    private Double discountAmount = 0.0;

    @Column(name = "discount_percentage")
    private Double discountPercentage = 0.0; // 0 to 100

    @Column(name = "min_order_amount")
    private Double minOrderAmount = 0.0;

    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "usage_limit")
    private Integer usageLimit = 100;

    @Column(name = "times_used")
    private Integer timesUsed = 0;
}
