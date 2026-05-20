package com.aura.ecommerce;

import com.aura.ecommerce.entity.Category;
import com.aura.ecommerce.entity.Coupon;
import com.aura.ecommerce.entity.Product;
import com.aura.ecommerce.entity.Review;
import com.aura.ecommerce.entity.User;
import com.aura.ecommerce.repository.CategoryRepository;
import com.aura.ecommerce.repository.CouponRepository;
import com.aura.ecommerce.repository.ProductRepository;
import com.aura.ecommerce.repository.ReviewRepository;
import com.aura.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CouponRepository couponRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info("Database already seeded. Skipping startup seeds.");
            return;
        }

        log.info("Seeding Aura E-Commerce Database...");

        // ==========================================
        // 1. SEED ACCOUNTS
        // ==========================================
        User admin = User.builder()
                .name("Aura Administrator")
                .email("admin@aura.com")
                .password(passwordEncoder.encode("admin123"))
                .role("ROLE_ADMIN")
                .isEnabled(true)
                .loyaltyPoints(1000)
                .provider("LOCAL")
                .build();

        User customer = User.builder()
                .name("Alex Rivers")
                .email("user@aura.com")
                .password(passwordEncoder.encode("user123"))
                .role("ROLE_USER")
                .isEnabled(true)
                .loyaltyPoints(350)
                .provider("LOCAL")
                .build();

        userRepository.saveAll(Arrays.asList(admin, customer));
        log.info("Successfully seeded accounts: admin@aura.com / user@aura.com");

        // ==========================================
        // 2. SEED CATEGORIES
        // ==========================================
        Category tech = Category.builder()
                .name("Tech & Audio")
                .description("Sleek minimalist electronics, charging blocks, and spatial audio accessories.")
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop")
                .build();

        Category apparel = Category.builder()
                .name("Minimalist Apparel")
                .description("Curated wardrobe basics crafted from premium organic cotton and fine linens.")
                .imageUrl("https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=600&auto=format&fit=crop")
                .build();

        Category home = Category.builder()
                .name("Home Living")
                .description("Ceramic cups, ambient desk lighting, and essential organizational modules.")
                .imageUrl("https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600&auto=format&fit=crop")
                .build();

        categoryRepository.saveAll(Arrays.asList(tech, apparel, home));
        log.info("Seeded categories: Tech, Apparel, Home Living");

        // ==========================================
        // 3. SEED PRODUCTS
        // ==========================================
        Product prod1 = Product.builder()
                .name("Aura Soundwave ANC Headphones")
                .description("Active noise-cancelling headphones featuring spatial acoustic soundscapes, brushed aluminum housing, and memory-foam leather cups. Battery lasts 40 hours on single charge.")
                .price(299.0)
                .discountPercentage(10.0)
                .stockQuantity(25)
                .imageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop")
                .rating(4.8)
                .reviewCount(2)
                .tags("audio, tech, headphone, active noise cancelling, soundwave, premium, spatial")
                .category(tech)
                .build();

        Product prod2 = Product.builder()
                .name("MagStand 3-in-1 Charging Block")
                .description("A solid-walnut magnetic desktop charging dock compatible with phone, smartwatch, and earbuds simultaneously. Eliminates desktop clutter elegantly.")
                .price(89.0)
                .discountPercentage(0.0)
                .stockQuantity(15)
                .imageUrl("https://images.unsplash.com/photo-1622445262465-248197576550?q=80&w=600&auto=format&fit=crop")
                .rating(4.5)
                .reviewCount(2)
                .tags("charger, magstand, desk organizer, tech, wood, magnetic, wireless")
                .category(tech)
                .build();

        Product prod3 = Product.builder()
                .name("LoomCraft Mechanical Keyboard")
                .description("Compact 75% hot-swappable custom typing deck. Features lubricated linear switches, solid anodized keycaps, dynamic warm amber backlights, and silent typing stabilizers.")
                .price(189.0)
                .discountPercentage(5.0)
                .stockQuantity(8)
                .imageUrl("https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop")
                .rating(5.0)
                .reviewCount(1)
                .tags("keyboard, mech, loomcraft, typing, custom, linear, tech, desktop")
                .category(tech)
                .build();

        Product prod4 = Product.builder()
                .name("Curated Linen Overshirt")
                .description("Relaxed-fit overshirt tailored from sustainable breathable French flax linen. Ideal for modular seasonal layering.")
                .price(75.0)
                .discountPercentage(0.0)
                .stockQuantity(30)
                .imageUrl("https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop")
                .rating(4.0)
                .reviewCount(1)
                .tags("shirt, linen, apparel, organic, flax, luxury clothing, basic")
                .category(apparel)
                .build();

        Product prod5 = Product.builder()
                .name("Slim-Shield Leather Cardholder")
                .description("Ultra-compact front-pocket card wallet crafted from full-grain vegetable-tanned leather. Includes secure integrated RFID shielding.")
                .price(45.0)
                .discountPercentage(15.0)
                .stockQuantity(50)
                .imageUrl("https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600&auto=format&fit=crop")
                .rating(4.7)
                .reviewCount(1)
                .tags("wallet, cardholder, leather, slim shield, rfid, apparel, minimalist")
                .category(apparel)
                .build();

        Product prod6 = Product.builder()
                .name("Stone-Cast Ceramic Mug")
                .description("Handmade stone-ceramic coffee mug. Finished with a dynamic matte black glaze, a heat-retaining heavy-bottom base, and an ergonomic circular handle.")
                .price(29.0)
                .discountPercentage(0.0)
                .stockQuantity(40)
                .imageUrl("https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop")
                .rating(4.9)
                .reviewCount(1)
                .tags("mug, ceramic, stone cast, cup, coffee, home living, matte, table")
                .category(home)
                .build();

        Product prod7 = Product.builder()
                .name("Onyx Matte Water Bottle")
                .description("Double-wall vacuum-insulated stainless steel water bottle. Retains ice-cold drinks for 24 hours, finished in a signature slip-resistant textured onyx coat.")
                .price(35.0)
                .discountPercentage(0.0)
                .stockQuantity(60)
                .imageUrl("https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop")
                .rating(4.0)
                .reviewCount(1)
                .tags("bottle, onyx, stainless steel, insulation, sport, home living, wellness")
                .category(home)
                .build();

        productRepository.saveAll(Arrays.asList(prod1, prod2, prod3, prod4, prod5, prod6, prod7));
        log.info("Seeded curated premium products catalog.");

        // ==========================================
        // 4. SEED COUPONS
        // ==========================================
        Coupon coup1 = Coupon.builder()
                .code("AURA50")
                .discountPercentage(50.0)
                .minOrderAmount(200.0)
                .expiryDate(LocalDateTime.now().plusMonths(3))
                .isActive(true)
                .usageLimit(100)
                .timesUsed(5)
                .build();

        Coupon coup2 = Coupon.builder()
                .code("WELCOME10")
                .discountPercentage(10.0)
                .minOrderAmount(0.0)
                .expiryDate(LocalDateTime.now().plusMonths(12))
                .isActive(true)
                .usageLimit(500)
                .timesUsed(82)
                .build();

        Coupon coup3 = Coupon.builder()
                .code("MINIMALIST")
                .discountAmount(25.0)
                .minOrderAmount(100.0)
                .expiryDate(LocalDateTime.now().plusMonths(2))
                .isActive(true)
                .usageLimit(50)
                .timesUsed(12)
                .build();

        couponRepository.saveAll(Arrays.asList(coup1, coup2, coup3));
        log.info("Seeded coupons: AURA50, WELCOME10, MINIMALIST");

        // ==========================================
        // 5. SEED REVIEWS (WITH SENTIMENTS)
        // ==========================================
        // Soundwave Headphones Reviews
        Review rev1 = Review.builder()
                .product(prod1)
                .user(customer)
                .rating(5)
                .comment("Absolutely amazing sound! The active noise cancelling is extremely premium and blocks out everything. Sleek minimalist look!")
                .sentiment("POSITIVE")
                .sentimentScore(0.9)
                .createdAt(LocalDateTime.now().minusDays(5))
                .build();

        Review rev2 = Review.builder()
                .product(prod1)
                .user(admin) // Admin can also leave reviews for testing!
                .rating(4)
                .comment("The soundscape is great but the head clamping force is slightly tight when worn for a slow day. Otherwise outstanding build quality!")
                .sentiment("POSITIVE")
                .sentimentScore(0.4)
                .createdAt(LocalDateTime.now().minusDays(3))
                .build();

        // MagStand Charger Reviews
        Review rev3 = Review.builder()
                .product(prod2)
                .user(customer)
                .rating(5)
                .comment("Minimalist design heaven. The walnut finish looks beautiful on my desk, wireless charging is fast and smooth.")
                .sentiment("POSITIVE")
                .sentimentScore(0.85)
                .createdAt(LocalDateTime.now().minusDays(10))
                .build();

        Review rev4 = Review.builder()
                .product(prod2)
                .user(admin)
                .rating(4)
                .comment("Extremely sleek wood aesthetic but sometimes my heavy phone slips if not placed perfectly on the center magnets. Still highly recommended.")
                .sentiment("POSITIVE")
                .sentimentScore(0.3)
                .createdAt(LocalDateTime.now().minusDays(2))
                .build();

        // Keyboard
        Review rev5 = Review.builder()
                .product(prod3)
                .user(customer)
                .rating(5)
                .comment("Perfect linear typing feel. Stabilizers are exceptionally quiet and the warm amber backlight is stunning. Best keyboard I have owned.")
                .sentiment("POSITIVE")
                .sentimentScore(0.95)
                .createdAt(LocalDateTime.now().minusDays(1))
                .build();

        // Apparel Overshirt
        Review rev6 = Review.builder()
                .product(prod4)
                .user(customer)
                .rating(4)
                .comment("Quality linen fabric. Fits relaxed as advertised, but the sleeves are slightly long. Good minimalist color tone.")
                .sentiment("POSITIVE")
                .sentimentScore(0.5)
                .createdAt(LocalDateTime.now().minusDays(8))
                .build();

        // Wallet
        Review rev7 = Review.builder()
                .product(prod5)
                .user(customer)
                .rating(5)
                .comment("Premium veg-tan leather, super thin profile. Fits comfortably in front pocket and RFID shielding works great.")
                .sentiment("POSITIVE")
                .sentimentScore(0.8)
                .createdAt(LocalDateTime.now().minusDays(4))
                .build();

        // Ceramic Mug
        Review rev8 = Review.builder()
                .product(prod6)
                .user(customer)
                .rating(5)
                .comment("Beautiful handcrafting. Keeps my morning coffee hot for longer and looks spectacular on my wooden workbench.")
                .sentiment("POSITIVE")
                .sentimentScore(0.9)
                .createdAt(LocalDateTime.now().minusDays(6))
                .build();

        // Water bottle (simulate bad review to showcase negative AI sentiment scoring)
        Review rev9 = Review.builder()
                .product(prod7)
                .user(customer)
                .rating(4)
                .comment("The vacuum insulation is great but the onyx coating started showing a small scratch after a week of standard use. Slightly disappointed by the paint durability.")
                .sentiment("NEGATIVE")
                .sentimentScore(-0.35)
                .createdAt(LocalDateTime.now().minusDays(12))
                .build();

        reviewRepository.saveAll(Arrays.asList(rev1, rev2, rev3, rev4, rev5, rev6, rev7, rev8, rev9));
        log.info("Seeded initial product reviews with AI sentiment markings.");

        log.info("Aura E-Commerce database seeding completed successfully!");
    }
}
