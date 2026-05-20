package com.aura.payment.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private Long userId;

    private double amount;

    private String status; // SUCCESS, FAILED, REFUNDED

    private String trackingId; // Stripe / PayPal reference code

    private String paymentMethod; // CARD, PAYPAL, UPI

    private Instant timestamp;
}
