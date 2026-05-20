package com.aura.review.controller;

import com.aura.review.model.Review;
import com.aura.review.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    // POST /api/reviews  (original)
    @PostMapping
    public ResponseEntity<Review> submitReview(@RequestBody Review review) {
        Review savedReview = reviewService.submitReview(review);
        return ResponseEntity.ok(savedReview);
    }

    // POST /api/reviews/product/{productId}  (frontend-compatible route)
    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> submitReviewForProduct(
            @PathVariable Long productId,
            @RequestBody Review review,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        review.setProductId(productId);
        // Optionally set userId from JWT header if needed in future
        Review savedReview = reviewService.submitReview(review);
        return ResponseEntity.ok(savedReview);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/sentiment")
    public ResponseEntity<Map<String, Object>> getSentimentAnalysis(@PathVariable Long productId) {
        Map<String, Object> aggregations = reviewService.getSentimentAggregations(productId);
        return ResponseEntity.ok(aggregations);
    }
}
