package com.aura.recommendation.controller;

import com.aura.recommendation.model.UserAction;
import com.aura.recommendation.service.RecommendationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/action")
    public ResponseEntity<UserAction> recordUserAction(@RequestBody ActionRequest request) {
        UserAction action = recommendationService.recordAction(
                request.getUserId(),
                request.getProductId(),
                request.getActionType(),
                request.getScore()
        );
        return ResponseEntity.ok(action);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getRecommendations(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "4") int limit
    ) {
        List<Map<String, Object>> recommendations = recommendationService.getHybridRecommendations(userId, limit);
        return ResponseEntity.ok(recommendations);
    }

    // Request Format
    @Data
    public static class ActionRequest {
        private Long userId;
        private Long productId;
        private String actionType;
        private double score;
    }
}
