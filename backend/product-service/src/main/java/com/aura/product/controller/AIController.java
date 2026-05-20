package com.aura.product.controller;

import com.aura.product.dto.ChatRequest;
import com.aura.product.dto.ChatResponse;
import com.aura.product.model.Product;
import com.aura.product.service.AIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin
public class AIController {

    private final AIService aiService;

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        ChatResponse response = aiService.processChat(request.getMessage(), request.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> semanticSearch(@RequestParam("query") String query) {
        List<Product> results = aiService.semanticSearch(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<Product>> getRecommendations(
            @RequestParam(value = "userId", required = false) Long userId
    ) {
        List<Product> recommendations = aiService.getPersonalizedRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/products/{id}/similar")
    public ResponseEntity<List<Product>> getSimilarProducts(@PathVariable("id") Long id) {
        List<Product> similar = aiService.getSimilarProducts(id);
        return ResponseEntity.ok(similar);
    }
}
