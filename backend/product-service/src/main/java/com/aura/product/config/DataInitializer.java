package com.aura.product.config;

import com.aura.product.model.Category;
import com.aura.product.model.Product;
import com.aura.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        if (productService.getAllCategories().isEmpty()) {
            System.out.println("No categories found. Seeding dummy product data...");

            // Create Categories
            Category electronics = productService.createCategory(Category.builder()
                    .name("Electronics")
                    .description("High-end flagship gadgets and devices")
                    .imageUrl("https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80")
                    .build());

            Category clothing = productService.createCategory(Category.builder()
                    .name("Clothing")
                    .description("Premium modern apparel and fashion accessories")
                    .imageUrl("https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&q=80")
                    .build());

            Category books = productService.createCategory(Category.builder()
                    .name("Books")
                    .description("Best-selling literature, tech manuals, and novels")
                    .imageUrl("https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=500&q=80")
                    .build());

            Category kitchen = productService.createCategory(Category.builder()
                    .name("Home & Kitchen")
                    .description("Barista-quality machines and home essentials")
                    .imageUrl("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80")
                    .build());

            // Create Products for Electronics
            productService.createProduct(Product.builder()
                    .name("Aura Pro Phone")
                    .description("Next-gen flagship smartphone with neural AI processor, 120Hz OLED screen, and triple lens camera system.")
                    .price(999.99)
                    .discountPercentage(10.0)
                    .imageUrl("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80")
                    .stockQuantity(50)
                    .rating(4.8)
                    .reviewCount(124)
                    .tags("smartphone, electronics, mobile, phone")
                    .category(electronics)
                    .build());

            productService.createProduct(Product.builder()
                    .name("Quantum Noise-Canceling Headphones")
                    .description("Wireless over-ear headphones with active noise cancellation, high-fidelity audio, and 40-hour battery life.")
                    .price(299.99)
                    .discountPercentage(5.0)
                    .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80")
                    .stockQuantity(120)
                    .rating(4.6)
                    .reviewCount(89)
                    .tags("headphones, audio, electronics, music")
                    .category(electronics)
                    .build());

            productService.createProduct(Product.builder()
                    .name("Apex Slim Laptop")
                    .description("Ultra-thin lightweight developer laptop with M3 chip, 32GB RAM, and 1TB SSD storage.")
                    .price(1299.99)
                    .discountPercentage(15.0)
                    .imageUrl("https://images.unsplash.com/photo-1496181130204-755241544e3d?w=500&q=80")
                    .stockQuantity(25)
                    .rating(4.9)
                    .reviewCount(42)
                    .tags("laptop, computer, electronics, developer")
                    .category(electronics)
                    .build());

            // Create Products for Clothing
            productService.createProduct(Product.builder()
                    .name("Classic Crewneck Tee")
                    .description("Premium heavyweight organic cotton minimalist crewneck t-shirt in stealth black.")
                    .price(24.99)
                    .imageUrl("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80")
                    .stockQuantity(200)
                    .rating(4.5)
                    .reviewCount(350)
                    .tags("clothing, shirt, apparel, minimalist")
                    .category(clothing)
                    .build());

            productService.createProduct(Product.builder()
                    .name("Aura Heritage Hoodie")
                    .description("Unisex ultra-soft fleece hoodie featuring double-lined hood and spacious kangaroo pocket.")
                    .price(59.99)
                    .imageUrl("https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&q=80")
                    .stockQuantity(150)
                    .rating(4.7)
                    .reviewCount(180)
                    .tags("clothing, hoodie, apparel, fleece")
                    .category(clothing)
                    .build());

            // Create Products for Books
            productService.createProduct(Product.builder()
                    .name("Designing Microservices Architectures")
                    .description("A comprehensive guide to building scalable, resilient, and event-driven cloud systems with Spring Boot and Kafka.")
                    .price(45.00)
                    .imageUrl("https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500&q=80")
                    .stockQuantity(80)
                    .rating(4.9)
                    .reviewCount(55)
                    .tags("book, tech, software, developer")
                    .category(books)
                    .build());

            productService.createProduct(Product.builder()
                    .name("The Silent Echo")
                    .description("Award-winning science fiction thriller about deep space exploration, AI sentience, and the first contact.")
                    .price(14.99)
                    .imageUrl("https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&q=80")
                    .stockQuantity(100)
                    .rating(4.3)
                    .reviewCount(310)
                    .tags("book, fiction, sci-fi, novel")
                    .category(books)
                    .build());

            // Create Products for Home & Kitchen
            productService.createProduct(Product.builder()
                    .name("Presto Espresso Machine")
                    .description("15-bar high pressure pump espresso maker with integrated steam wand for barista-quality cappuccinos and lattes.")
                    .price(189.99)
                    .discountPercentage(10.0)
                    .imageUrl("https://images.unsplash.com/photo-1517637382994-f02da38c6128?w=500&q=80")
                    .stockQuantity(40)
                    .rating(4.7)
                    .reviewCount(68)
                    .tags("kitchen, coffee, appliance, espresso")
                    .category(kitchen)
                    .build());

            System.out.println("Dummy product data successfully seeded!");
        } else {
            System.out.println("Database already contains product data. Skipping seeding.");
        }
    }
}
