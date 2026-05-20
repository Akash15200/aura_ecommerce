package com.aura.review.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    private String id;

    private Long productId;
    private Long userId;
    private String userName;

    private double rating;
    private String comment;

    // AI analytics fields
    private double sentimentScore; // 0.0 (Extremely Negative) to 1.0 (Extremely Positive)
    private String sentimentLabel;  // POSITIVE, NEUTRAL, NEGATIVE
    private boolean spam;

    private Instant timestamp;
}
