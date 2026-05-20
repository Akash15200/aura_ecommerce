package com.aura.ecommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer rating; // 1 to 5 stars

    @Column(nullable = false, length = 1500)
    private String comment;

    @Column(name = "image_url", length = 1000)
    private String imageUrl; // Optional review image attachment

    @Column(nullable = false)
    private String sentiment = "NEUTRAL"; // "POSITIVE", "NEUTRAL", "NEGATIVE"

    @Column(name = "sentiment_score")
    private Double sentimentScore = 0.0; // Raw index ranging from -1.0 to +1.0

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
