package com.aura.ecommerce.controller;

import com.aura.ecommerce.dto.ChatRequest;
import com.aura.ecommerce.dto.ChatResponse;
import com.aura.ecommerce.dto.ProductDto;
import com.aura.ecommerce.service.AIService;
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
    public ResponseEntity<List<ProductDto>> semanticSearch(@RequestParam("query") String query) {
        List<ProductDto> results = aiService.semanticSearch(query);
        return ResponseEntity.ok(results);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<ProductDto>> getRecommendations(
            @RequestParam(value = "userId", required = false) Long userId
    ) {
        List<ProductDto> recommendations = aiService.getPersonalizedRecommendations(userId);
        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/products/{id}/similar")
    public ResponseEntity<List<ProductDto>> getSimilarProducts(@PathVariable("id") Long id) {
        List<ProductDto> similar = aiService.getSimilarProducts(id);
        return ResponseEntity.ok(similar);
    }
}
