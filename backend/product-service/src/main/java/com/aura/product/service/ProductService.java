package com.aura.product.service;

import com.aura.product.event.InventoryAdjustedEvent;
import com.aura.product.model.Category;
import com.aura.product.model.Product;
import com.aura.product.repository.CategoryRepository;
import com.aura.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final SearchService searchService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Cacheable(value = "products", key = "#id")
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product catalog item not found."));
    }

    public Page<Product> getProductsByCategory(Long categoryId, Pageable pageable) {
        return productRepository.findByCategoryId(categoryId, pageable);
    }

    public Page<Product> getProducts(Long categoryId, double minPrice, double maxPrice, Pageable pageable) {
        if (categoryId != null) {
            return productRepository.findByCategoryIdAndPriceBetween(categoryId, minPrice, maxPrice, pageable);
        }
        return productRepository.findByPriceBetween(minPrice, maxPrice, pageable);
    }

    @Transactional
    @CacheEvict(value = "products", allEntries = true)
    public Product createProduct(Product product) {
        Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new RuntimeException("Target category collection not found."));
        product.setCategory(category);

        Product savedProduct = productRepository.save(product);

        // Sync with Elasticsearch vector search index
        searchService.indexProduct(
                savedProduct.getId(),
                savedProduct.getName(),
                savedProduct.getDescription(),
                savedProduct.getPrice(),
                category.getName(),
                savedProduct.getTags(),
                savedProduct.getRating()
        );

        return savedProduct;
    }

    @Transactional
    @CacheEvict(value = "products", key = "#id")
    public Product updateStock(Long id, int quantityPurchased) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product catalog item not found."));

        if (product.getStockQuantity() < quantityPurchased) {
            throw new RuntimeException("Insufficient stock available for product: " + product.getName());
        }

        product.setStockQuantity(product.getStockQuantity() - quantityPurchased);
        Product updatedProduct = productRepository.save(product);

        // Standard low-stock alert threshold (e.g. 5 items)
        if (updatedProduct.getStockQuantity() < 5) {
            System.out.println("==================================================================");
            System.out.println("ALERT: PRODUCT STOCK CRITICALLY LOW: " + updatedProduct.getName().toUpperCase());
            System.out.println("CURRENT QUANTITY IN STORAGE: " + updatedProduct.getStockQuantity());
            System.out.println("==================================================================");
        }

        // Emit Kafka inventory event
        InventoryAdjustedEvent event = InventoryAdjustedEvent.builder()
                .productId(updatedProduct.getId())
                .newStockQuantity(updatedProduct.getStockQuantity())
                .timestamp(System.currentTimeMillis())
                .build();
        try {
            kafkaTemplate.send("inventory-events", updatedProduct.getId().toString(), event);
        } catch (Exception e) {
            System.err.println("Kafka broker offline, caching stock adjustment: " + e.getMessage());
        }

        return updatedProduct;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new RuntimeException("Category collection is already created.");
        }
        return categoryRepository.save(category);
    }
}
