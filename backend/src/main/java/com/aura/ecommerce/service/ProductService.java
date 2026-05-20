package com.aura.ecommerce.service;

import com.aura.ecommerce.dto.ProductDto;
import com.aura.ecommerce.entity.Category;
import com.aura.ecommerce.entity.Product;
import com.aura.ecommerce.exception.ResourceNotFoundException;
import com.aura.ecommerce.repository.CategoryRepository;
import com.aura.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    // ==========================================
    // 1. PUBLIC CATALOG GETTERS
    // ==========================================
    public Page<ProductDto> getFilteredProducts(Long categoryId, Double minPrice, Double maxPrice, Pageable pageable) {
        double min = minPrice != null ? minPrice : 0.0;
        double max = maxPrice != null ? maxPrice : 1000000.0;
        
        return productRepository.filterProducts(categoryId, min, max, pageable)
                .map(this::mapToDto);
    }

    @Cacheable(value = "products", key = "#id")
    public ProductDto getProductById(Long id) {
        log.info("Fetching product ID: {} from Database (Cache Miss)", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        return mapToDto(product);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // ==========================================
    // 2. ADMIN CRUD INTERFACES
    // ==========================================
    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public ProductDto createProduct(ProductDto dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .discountPercentage(dto.getDiscountPercentage() != null ? dto.getDiscountPercentage() : 0.0)
                .stockQuantity(dto.getStockQuantity())
                .imageUrl(dto.getImageUrl())
                .tags(dto.getTags())
                .category(category)
                .rating(0.0)
                .reviewCount(0)
                .build();

        return mapToDto(productRepository.save(product));
    }

    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + dto.getCategoryId()));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setDiscountPercentage(dto.getDiscountPercentage());
        product.setStockQuantity(dto.getStockQuantity());
        product.setImageUrl(dto.getImageUrl());
        product.setTags(dto.getTags());
        product.setCategory(category);

        return mapToDto(productRepository.save(product));
    }

    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        productRepository.delete(product);
    }

    @Transactional
    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    // ==========================================
    // HELPER MAPPING UTILITIES
    // ==========================================
    public ProductDto mapToDto(Product p) {
        return ProductDto.builder()
                .id(p.getId())
                .name(p.getName())
                .description(p.getDescription())
                .price(p.getPrice())
                .discountPercentage(p.getDiscountPercentage())
                .stockQuantity(p.getStockQuantity())
                .imageUrl(p.getImageUrl())
                .rating(p.getRating())
                .reviewCount(p.getReviewCount())
                .tags(p.getTags())
                .categoryId(p.getCategory().getId())
                .categoryName(p.getCategory().getName())
                .build();
    }
}
