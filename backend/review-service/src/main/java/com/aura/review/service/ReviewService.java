package com.aura.review.service;

import com.aura.review.model.Review;
import com.aura.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final Set<String> POSITIVE_WORDS = new HashSet<>(Arrays.asList(
            "elegant", "beautiful", "premium", "wowed", "perfect", "high-end", "smooth", "excellent", 
            "great", "love", "best", "fantastic", "superb", "luxury", "amazing", "stunning"
    ));

    private static final Set<String> NEGATIVE_WORDS = new HashSet<>(Arrays.asList(
            "bad", "broke", "cheap", "delayed", "terrible", "worse", "disappointing", "poor", 
            "slow", "defect", "garbage", "hate", "return", "broken", "worst"
    ));

    private static final Set<String> SPAM_TRIGGERS = new HashSet<>(Arrays.asList(
            "free money", "buy now", "click here", "promo code", "work from home", "earn cash", "http"
    ));

    @Transactional
    public Review submitReview(Review review) {
        String commentLower = review.getComment() != null ? review.getComment().toLowerCase() : "";

        // 1. Check for Spam review
        boolean isSpam = false;
        for (String trigger : SPAM_TRIGGERS) {
            if (commentLower.contains(trigger)) {
                isSpam = true;
                break;
            }
        }
        // Reject repetitive UPPERCASE locks
        if (review.getComment() != null && review.getComment().equals(review.getComment().toUpperCase()) && review.getComment().length() > 15) {
            isSpam = true;
        }
        review.setSpam(isSpam);

        // 2. Perform Lexicon AI Sentiment Analysis
        double score = 0.5; // Default neutral state
        String[] words = commentLower.split("\\W+");
        double posCount = 0;
        double negCount = 0;

        for (String w : words) {
            if (POSITIVE_WORDS.contains(w)) posCount++;
            else if (NEGATIVE_WORDS.contains(w)) negCount++;
        }

        if (posCount > 0 || negCount > 0) {
            // Project onto 0.0 - 1.0 range
            score = (posCount - negCount) / (posCount + negCount);
            score = (score + 1.0) / 2.0;
        }

        // Apply weight of numerical star rating
        double ratingWeight = (review.getRating() - 1.0) / 4.0; // Map 1-5 to 0-1
        score = (score * 0.4) + (ratingWeight * 0.6); // Weight rating heavily

        review.setSentimentScore(score);
        if (score >= 0.6) {
            review.setSentimentLabel("POSITIVE");
        } else if (score <= 0.4) {
            review.setSentimentLabel("NEGATIVE");
        } else {
            review.setSentimentLabel("NEUTRAL");
        }

        review.setTimestamp(Instant.now());

        Review savedReview = reviewRepository.save(review);

        // Stream notification updates via Kafka to notify catalog metrics calculators
        Map<String, Object> event = new HashMap<>();
        event.put("productId", savedReview.getProductId());
        event.put("rating", savedReview.getRating());
        event.put("sentiment", savedReview.getSentimentLabel());
        event.put("type", "REVIEW_SUBMITTED");

        try {
            kafkaTemplate.send("review-events", savedReview.getProductId().toString(), event);
        } catch (Exception e) {
            System.err.println("Kafka offline, caching review stream changes: " + e.getMessage());
        }

        return savedReview;
    }

    public List<Review> getReviewsForProduct(Long productId) {
        // Exclude spam reviews from public search grid
        return reviewRepository.findByProductId(productId).stream()
                .filter(r -> !r.isSpam())
                .toList();
    }

    public Map<String, Object> getSentimentAggregations(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        
        long positive = 0;
        long neutral = 0;
        long negative = 0;
        double totalScore = 0.0;

        for (Review r : reviews) {
            if (r.isSpam()) continue;
            
            totalScore += r.getSentimentScore();
            if ("POSITIVE".equals(r.getSentimentLabel())) positive++;
            else if ("NEGATIVE".equals(r.getSentimentLabel())) negative++;
            else neutral++;
        }

        long total = positive + neutral + negative;
        double averageSentiment = total > 0 ? (totalScore / total) * 100 : 50.0; // Percentage positive weight

        Map<String, Object> stats = new HashMap<>();
        stats.put("productId", productId);
        stats.put("totalReviewsCount", total);
        stats.put("positiveCount", positive);
        stats.put("neutralCount", neutral);
        stats.put("negativeCount", negative);
        stats.put("averageSentimentPercentage", averageSentiment);
        return stats;
    }
}
