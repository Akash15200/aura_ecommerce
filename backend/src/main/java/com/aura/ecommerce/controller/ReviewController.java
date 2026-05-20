package com.aura.ecommerce.controller;

import com.aura.ecommerce.dto.SentimentResponse;
import com.aura.ecommerce.entity.Review;
import com.aura.ecommerce.entity.User;
import com.aura.ecommerce.repository.UserRepository;
import com.aura.ecommerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable("productId") Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsForProduct(productId));
    }

    @GetMapping("/product/{productId}/sentiment")
    public ResponseEntity<SentimentResponse> getProductSentiment(@PathVariable("productId") Long productId) {
        return ResponseEntity.ok(reviewService.getProductSentimentStats(productId));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<Review> submitReview(
            @PathVariable("productId") Long productId,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Session user not found"));

        Integer rating = (Integer) body.get("rating");
        String comment = (String) body.get("comment");
        String imageUrl = (String) body.get("imageUrl");

        Review review = reviewService.createReview(productId, rating, comment, imageUrl, user);
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }
}
