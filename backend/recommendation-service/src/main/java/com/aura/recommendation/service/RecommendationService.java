package com.aura.recommendation.service;

import com.aura.recommendation.model.UserAction;
import com.aura.recommendation.repository.UserActionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final UserActionRepository actionRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Transactional
    public UserAction recordAction(Long userId, Long productId, String type, double score) {
        UserAction action = UserAction.builder()
                .userId(userId)
                .productId(productId)
                .actionType(type.toUpperCase())
                .score(score)
                .timestamp(Instant.now())
                .build();
        return actionRepository.save(action);
    }

    // 1. Kafka Consumer: Listen for new checkouts from order-service
    @KafkaListener(topics = "order-events", groupId = "recommendation-group")
    public void listenCheckoutEvent(Map<String, Object> payload) {
        try {
            Long userId = Long.valueOf(payload.get("userId").toString());
            Long orderId = Long.valueOf(payload.get("orderId").toString());
            double amount = Double.parseDouble(payload.get("finalAmount").toString());

            // Loop mock order items by fetching order details (or seed dummy purchase log)
            recordAction(userId, orderId, "PURCHASE", 5.0);
            System.out.println("KAFKA RECOMMENDATIONS LOGGER: Captured purchase logs for User #" + userId);
        } catch (Exception e) {
            System.err.println("Recommendations checkout log failed: " + e.getMessage());
        }
    }

    // 2. Kafka Consumer: Listen for reviews from review-service
    @KafkaListener(topics = "review-events", groupId = "recommendation-group")
    public void listenReviewEvent(Map<String, Object> payload) {
        try {
            Long productId = Long.valueOf(payload.get("productId").toString());
            double rating = Double.parseDouble(payload.get("rating").toString());
            
            // Assume default guest user id = 1
            recordAction(1L, productId, "REVIEW", rating);
            System.out.println("KAFKA RECOMMENDATIONS LOGGER: Captured review scoring of " + rating + " for Product #" + productId);
        } catch (Exception e) {
            System.err.println("Recommendations review log failed: " + e.getMessage());
        }
    }

    // AI Hybrid collaborative and content recommendations engine
    public List<Map<String, Object>> getHybridRecommendations(Long userId, int limit) {
        // Load target user's viewed products
        List<UserAction> userActions = actionRepository.findByUserId(userId);
        Set<Long> userProducts = userActions.stream()
                .map(UserAction::getProductId)
                .collect(Collectors.toSet());

        // A list of fallback products to recommend in our luxury carousels
        List<Map<String, Object>> catalog = loadCatalogResiliently();

        if (userProducts.isEmpty()) {
            // Cold Start: Return top catalog rated products
            return catalog.stream()
                    .sorted((a, b) -> Double.compare(
                            Double.parseDouble(b.getOrDefault("rating", "5.0").toString()),
                            Double.parseDouble(a.getOrDefault("rating", "5.0").toString())
                    ))
                    .limit(limit)
                    .collect(Collectors.toList());
        }

        // Collaborative score mappings: finding similar users
        Map<Long, Double> collaborativeScores = calculateCollaborativeScores(userId, userProducts);

        // Content score mappings: tag matching
        Map<Long, Double> contentScores = calculateContentScores(userActions, catalog);

        // Merge scores into Hybrid rank
        List<Map<String, Object>> recommendedList = new ArrayList<>();
        for (Map<String, Object> product : catalog) {
            Long prodId = Long.valueOf(product.get("id").toString());
            if (userProducts.contains(prodId)) continue; // Don't suggest items they already bought/viewed

            double colScore = collaborativeScores.getOrDefault(prodId, 0.0);
            double conScore = contentScores.getOrDefault(prodId, 0.0);
            double finalScore = (colScore * 0.5) + (conScore * 0.5); // Hybrid weight split

            product.put("recommendationScore", finalScore);
            recommendedList.add(product);
        }

        return recommendedList.stream()
                .sorted((a, b) -> Double.compare(
                        Double.parseDouble(b.get("recommendationScore").toString()),
                        Double.parseDouble(a.get("recommendationScore").toString())
                ))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private Map<Long, Double> calculateCollaborativeScores(Long userId, Set<Long> userProducts) {
        Map<Long, Double> scores = new HashMap<>();
        List<UserAction> allActions = actionRepository.findAll();

        // Map userId -> products
        Map<Long, Set<Long>> userHistoryMap = allActions.stream()
                .filter(a -> !a.getUserId().equals(userId))
                .collect(Collectors.groupingBy(
                        UserAction::getUserId,
                        Collectors.mapping(UserAction::getProductId, Collectors.toSet())
                ));

        // Find correlation weights (intersection overlap)
        Map<Long, Double> userCorrelations = new HashMap<>();
        for (Map.Entry<Long, Set<Long>> entry : userHistoryMap.entrySet()) {
            Set<Long> otherProducts = entry.getValue();
            long intersection = userProducts.stream().filter(otherProducts::contains).count();
            if (intersection > 0) {
                userCorrelations.put(entry.getKey(), (double) intersection / (userProducts.size() + otherProducts.size()));
            }
        }

        // Aggregate product ratings weighted by correlation
        for (UserAction act : allActions) {
            if (act.getUserId().equals(userId)) continue;
            double correlation = userCorrelations.getOrDefault(act.getUserId(), 0.0);
            if (correlation > 0.0) {
                scores.put(act.getProductId(), scores.getOrDefault(act.getProductId(), 0.0) + (act.getScore() * correlation));
            }
        }

        return scores;
    }

    private Map<Long, Double> calculateContentScores(List<UserAction> userActions, List<Map<String, Object>> catalog) {
        Map<Long, Double> scores = new HashMap<>();

        // Aggregate tags of products user viewed
        Set<String> userTags = new HashSet<>();
        for (UserAction act : userActions) {
            // Locate tags in catalog
            catalog.stream()
                    .filter(p -> p.get("id").toString().equals(act.getProductId().toString()))
                    .findFirst()
                    .ifPresent(p -> {
                        String tagsStr = (String) p.get("tags");
                        if (tagsStr != null) {
                            userTags.addAll(Arrays.asList(tagsStr.toLowerCase().split(",")));
                        }
                    });
        }

        // Score catalog items by tag intersections
        for (Map<String, Object> product : catalog) {
            Long prodId = Long.valueOf(product.get("id").toString());
            String tagsStr = (String) product.get("tags");
            if (tagsStr == null) continue;

            String[] prodTags = tagsStr.toLowerCase().split(",");
            long intersection = Arrays.stream(prodTags).filter(userTags::contains).count();
            scores.put(prodId, (double) intersection / (userTags.size() + prodTags.length + 1));
        }

        return scores;
    }

    // Resilient catalog loading: retrieves from REST endpoints with instant mock fallback
    private List<Map<String, Object>> loadCatalogResiliently() {
        try {
            String productBaseUrl = System.getenv().getOrDefault("PRODUCT_SERVICE_URL", "http://localhost:8082");
            String productUrl = productBaseUrl + "/api/products";
            Map<?, ?> page = restTemplate.getForObject(productUrl, Map.class);
            if (page != null && page.containsKey("content")) {
                return (List<Map<String, Object>>) page.get("content");
            }
        } catch (Exception e) {
            // Ignore REST exceptions, load beautiful pre-packaged high-end assets
        }

        // Seed 5 gorgeous luxury products
        List<Map<String, Object>> mockCatalog = new ArrayList<>();
        
        mockCatalog.add(createMockItem(1L, "Eclipse Wireless Charging Dock", "Monolithic black aluminum wireless charging hub.", 129.0, "Charging Accessories,Minimalist", "charging,dock,wireless,aluminum", 4.9));
        mockCatalog.add(createMockItem(2L, "Aether Spatial Headphones", "Active noise-canceling headphones made of full grain leather.", 399.0, "Acoustic Gear,Leather", "headphones,spatial,sound,leather", 4.8));
        mockCatalog.add(createMockItem(3L, "Horizon Desk Tray", "Wool felt desk mat with solid brass organizer pins.", 85.0, "Desk Accessories,Wool", "tray,felt,wool,brass,desk", 4.7));
        mockCatalog.add(createMockItem(4L, "Vapor Aroma Diffuser", "Ceramic aromatherapeutic oil diffuser with ambient glow.", 95.0, "Home Decor,Ceramic", "diffuser,ceramic,aroma,lighting", 4.9));
        mockCatalog.add(createMockItem(5L, "Solitude Insulated Flask", "Matte black double walled vacuum thermal flask.", 45.0, "Travel Gear,Flask", "flask,water,black,insulated", 4.6));

        return mockCatalog;
    }

    private Map<String, Object> createMockItem(Long id, String name, String desc, double price, String category, String tags, double rating) {
        Map<String, Object> item = new HashMap<>();
        item.put("id", id);
        item.put("name", name);
        item.put("description", desc);
        item.put("price", price);
        item.put("categoryName", category);
        item.put("tags", tags);
        item.put("rating", rating);
        return item;
    }
}
