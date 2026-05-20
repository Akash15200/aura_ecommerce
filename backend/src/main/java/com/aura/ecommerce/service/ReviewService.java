package com.aura.ecommerce.service;

import com.aura.ecommerce.dto.SentimentResponse;
import com.aura.ecommerce.entity.Product;
import com.aura.ecommerce.entity.Review;
import com.aura.ecommerce.entity.User;
import com.aura.ecommerce.exception.ResourceNotFoundException;
import com.aura.ecommerce.repository.ProductRepository;
import com.aura.ecommerce.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final AIService aiService;

    // ==========================================
    // 1. DYNAMIC REVIEW SUBMISSION WITH AI SENTIMENT
    // ==========================================
    @Transactional
    public Review createReview(Long productId, Integer rating, String comment, String imageUrl, User user) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + productId));

        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5 stars.");
        }

        // Invoke Local Java AI Suite to calculate review sentiment metrics
        Map<String, Object> sentimentData = aiService.analyzeReviewSentiment(comment);
        String sentiment = (String) sentimentData.get("sentiment");
        Double score = (Double) sentimentData.get("score");

        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(rating)
                .comment(comment)
                .imageUrl(imageUrl)
                .sentiment(sentiment)
                .sentimentScore(score)
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        // Recalculate average ratings and reviews count for the Product
        Double newAverage = reviewRepository.getAverageRating(productId);
        product.setRating(newAverage != null ? newAverage : (double) rating);
        product.setReviewCount(product.getReviewCount() + 1);
        productRepository.save(product);

        return savedReview;
    }

    // ==========================================
    // 2. FETCH REVIEW LISTINGS & METRICS
    // ==========================================
    public List<Review> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public SentimentResponse getProductSentimentStats(Long productId) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
        return aiService.compileProductSentiment(reviews);
    }
}
