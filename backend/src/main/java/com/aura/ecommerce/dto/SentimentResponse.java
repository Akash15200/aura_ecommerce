package com.aura.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SentimentResponse {
    private Double averageSentimentScore; // Ranges from -1.0 to 1.0
    private Integer positiveCount;
    private Integer neutralCount;
    private Integer negativeCount;
    private Integer totalReviews;
}
