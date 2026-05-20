package com.aura.product.controller;

import com.aura.product.document.ProductDocument;
import com.aura.product.model.Product;
import com.aura.product.service.ProductService;
import com.aura.product.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final SearchService searchService;

    @GetMapping
    public ResponseEntity<Page<Product>> getAllProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        double min = minPrice != null ? minPrice : 0.0;
        double max = maxPrice != null ? maxPrice : 999999.0;
        
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return ResponseEntity.ok(productService.getProducts(categoryId, min, max, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.createProduct(product));
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<Product> deductStock(@PathVariable Long id, @RequestParam int quantity) {
        return ResponseEntity.ok(productService.updateStock(id, quantity));
    }

    // AI Feature: Dynamic Vector Semantic search connecting Cosine similarities
    @GetMapping("/search")
    public ResponseEntity<List<ProductDocument>> searchProducts(
            @RequestParam String query,
            @RequestParam(defaultValue = "10") int limit
    ) {
        List<ProductDocument> results = searchService.semanticSearch(query, limit);
        return ResponseEntity.ok(results);
    }
}
