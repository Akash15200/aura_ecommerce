package com.aura.product.service;

import com.aura.product.event.InventoryAdjustedEvent;
import com.aura.product.model.Category;
import com.aura.product.model.Product;
import com.aura.product.repository.CategoryRepository;
import com.aura.product.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SearchService searchService;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private ProductService productService;

    @Test
    void getProductById_Success() {
        Product product = Product.builder().id(1L).name("Test Product").price(10.0).build();
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals("Test Product", result.getName());
        assertEquals(10.0, result.getPrice());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getProductById_NotFound_ThrowsException() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            productService.getProductById(1L)
        );

        assertEquals("Product catalog item not found.", exception.getMessage());
    }

    @Test
    void createProduct_Success() {
        Category category = Category.builder().id(1L).name("Decor").build();
        Product productInput = Product.builder().name("Vase").category(category).price(49.99).build();
        Product savedProduct = Product.builder().id(100L).name("Vase").category(category).price(49.99).build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        Product result = productService.createProduct(productInput);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals("Vase", result.getName());
        assertEquals(49.99, result.getPrice());
        verify(searchService, times(1)).indexProduct(
                eq(100L), eq("Vase"), any(), eq(49.99), eq("Decor"), any(), anyDouble()
        );
    }

    @Test
    void updateStock_Success() {
        Product product = Product.builder().id(1L).name("Cup").stockQuantity(10).build();
        Product updatedProduct = Product.builder().id(1L).name("Cup").stockQuantity(7).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(updatedProduct);

        Product result = productService.updateStock(1L, 3);

        assertNotNull(result);
        assertEquals(7, result.getStockQuantity());
        verify(productRepository, times(1)).save(product);
        verify(kafkaTemplate, times(1)).send(eq("inventory-events"), eq("1"), any(InventoryAdjustedEvent.class));
    }

    @Test
    void updateStock_Insufficient_ThrowsException() {
        Product product = Product.builder().id(1L).name("Cup").stockQuantity(2).build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            productService.updateStock(1L, 5)
        );

        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(productRepository, never()).save(any());
    }
}
