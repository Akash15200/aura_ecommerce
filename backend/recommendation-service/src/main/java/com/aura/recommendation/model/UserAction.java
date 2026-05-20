package com.aura.recommendation.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "user_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAction {

    @Id
    private String id;

    private Long userId;
    private Long productId;

    private String actionType; // VIEW, CART, PURCHASE, REVIEW
    private double score;      // Numeric weight (e.g. 1.0 for view, 5.0 for purchase/review rating)

    private Instant timestamp;
}
