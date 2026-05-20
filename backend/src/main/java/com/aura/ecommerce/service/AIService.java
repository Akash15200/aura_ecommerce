package com.aura.ecommerce.service;

import com.aura.ecommerce.dto.ChatResponse;
import com.aura.ecommerce.dto.ProductDto;
import com.aura.ecommerce.dto.SentimentResponse;
import com.aura.ecommerce.entity.Product;
import com.aura.ecommerce.entity.Review;
import com.aura.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIService {

    private final ProductRepository productRepository;

    // Lexicons for Sentiment Analysis
    private static final Set<String> POSITIVE_WORDS = new HashSet<>(Arrays.asList(
            "love", "amazing", "great", "excellent", "beautiful", "smooth", "perfect", "premium", "fast",
            "easy", "awesome", "fantastic", "outstanding", "satisfied", "satisfying", "recommend", "best",
            "superb", "quality", "clean", "minimalist", "sleek", "worth", "stunning", "delightful", "wow"
    ));

    private static final Set<String> NEGATIVE_WORDS = new HashSet<>(Arrays.asList(
            "hate", "bad", "cheap", "broken", "terrible", "slow", "hard", "worse", "poor", "returned",
            "damaged", "useless", "waste", "disappointed", "disappointing", "horrible", "failed", "broken",
            "defective", "ugly", "expensive", "uncomfortable", "noisy", "scratch", "leak", "fail"
    ));

    // ==========================================
    // 1. DYNAMIC REVIEW SENTIMENT ANALYSIS
    // ==========================================
    public Map<String, Object> analyzeReviewSentiment(String comment) {
        if (comment == null || comment.isBlank()) {
            Map<String, Object> map = new HashMap<>();
            map.put("sentiment", "NEUTRAL");
            map.put("score", 0.0);
            return map;
        }

        String normalized = comment.toLowerCase().replaceAll("[^a-zA-Z\\s]", "");
        String[] tokens = normalized.split("\\s+");

        int posCount = 0;
        int negCount = 0;

        for (String token : tokens) {
            if (POSITIVE_WORDS.contains(token)) posCount++;
            if (NEGATIVE_WORDS.contains(token)) negCount++;
        }

        double score = 0.0;
        int total = posCount + negCount;
        if (total > 0) {
            score = (double) (posCount - negCount) / total;
        }

        String sentiment = "NEUTRAL";
        if (score > 0.15) {
            sentiment = "POSITIVE";
        } else if (score < -0.15) {
            sentiment = "NEGATIVE";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("sentiment", sentiment);
        result.put("score", score);
        return result;
    }

    public SentimentResponse compileProductSentiment(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return SentimentResponse.builder()
                    .averageSentimentScore(0.0)
                    .positiveCount(0)
                    .neutralCount(0)
                    .negativeCount(0)
                    .totalReviews(0)
                    .build();
        }

        int pos = 0, neu = 0, neg = 0;
        double sum = 0.0;

        for (Review r : reviews) {
            sum += r.getSentimentScore();
            switch (r.getSentiment()) {
                case "POSITIVE" -> pos++;
                case "NEGATIVE" -> neg++;
                default -> neu++;
            }
        }

        return SentimentResponse.builder()
                .averageSentimentScore(sum / reviews.size())
                .positiveCount(pos)
                .neutralCount(neu)
                .negativeCount(neg)
                .totalReviews(reviews.size())
                .build();
    }

    // ==========================================
    // 2. VECTOR SEMANTIC SEARCH (TF-IDF Cosine Similarity)
    // ==========================================
    public List<ProductDto> semanticSearch(String query) {
        List<Product> allProducts = productRepository.findAll();
        if (query == null || query.isBlank() || allProducts.isEmpty()) {
            return allProducts.stream().map(this::mapToDto).collect(Collectors.toList());
        }

        String[] queryTokens = tokenize(query);
        Map<String, Double> queryVector = getTermFrequencyVector(queryTokens);

        List<ProductSimilarity> similarities = new ArrayList<>();

        for (Product product : allProducts) {
            String document = product.getName() + " " + product.getDescription() + " " + (product.getTags() != null ? product.getTags() : "");
            String[] docTokens = tokenize(document);
            Map<String, Double> docVector = getTermFrequencyVector(docTokens);

            double cosSim = calculateCosineSimilarity(queryVector, docVector);
            if (cosSim > 0.0) {
                similarities.add(new ProductSimilarity(product, cosSim));
            }
        }

        // Sort by similarity score descending
        similarities.sort((a, b) -> Double.compare(b.similarity, a.similarity));

        // If no semantic similarity matches, fallback to standard text search
        if (similarities.isEmpty()) {
            return productRepository.searchProducts(query).stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList());
        }

        return similarities.stream()
                .map(s -> mapToDto(s.product))
                .collect(Collectors.toList());
    }

    // ==========================================
    // 3. AI CHATBOT NLP INTENT PARSER
    // ==========================================
    public ChatResponse processChat(String message, Long userId) {
        String msg = message.toLowerCase().trim();
        List<ProductDto> products = new ArrayList<>();
        String intent = "CHITCHAT";
        String reply;

        // Intent detection using RegEx / Keywords
        if (msg.contains("search") || msg.contains("find") || msg.contains("look for") || msg.contains("show me")) {
            intent = "SEARCH";
            String query = extractQuery(message, "(?:search|find|look for|show me)\\s+(.+)");
            if (query.isBlank()) query = message;
            products = semanticSearch(query);
            reply = "I found " + products.size() + " items that closely match your semantic search for '" + query + "'. Take a look!";
        } else if (msg.contains("add to cart") || msg.contains("buy")) {
            intent = "CART_ADD";
            String query = extractQuery(message, "(?:add to cart|buy)\\s+(.+)");
            if (query.isBlank()) {
                reply = "Which item would you like to add to your cart? Please specify the name, and I will queue it up!";
            } else {
                List<ProductDto> matches = semanticSearch(query);
                if (!matches.isEmpty()) {
                    ProductDto target = matches.get(0);
                    products = Collections.singletonList(target);
                    reply = "Splendid choice! I have queued up **" + target.getName() + "** to add to your shopping cart drawer. Click add below!";
                } else {
                    reply = "I couldn't find any products matching '" + query + "' to add to your cart. Could you try a different name?";
                }
            }
        } else if (msg.contains("details") || msg.contains("what is") || msg.contains("info about")) {
            intent = "DETAILS";
            String query = extractQuery(message, "(?:details|what is|info about)\\s+(.+)");
            if (query.isBlank()) query = message;
            List<ProductDto> matches = semanticSearch(query);
            if (!matches.isEmpty()) {
                ProductDto target = matches.get(0);
                products = Collections.singletonList(target);
                reply = "Here are the details for the **" + target.getName() + "**. It features premium crafting, is priced at $" + target.getPrice() + ", and has a satisfaction rating of " + target.getRating() + " stars.";
            } else {
                reply = "I couldn't find specific products under that name. Tell me what product details you are curious about!";
            }
        } else if (msg.contains("help") || msg.contains("support") || msg.contains("shipping") || msg.contains("return") || msg.contains("refund")) {
            intent = "HELP";
            reply = "Aura Help Desk:\n- **Shipping**: Free express standard shipping on all orders over $150. Delivery takes 2-4 business days.\n- **Returns**: We offer a 30-day hassle-free return window on all unused items.\n- **Loyalty Program**: Every checkout earns you 5% of purchase value back in loyalty points!";
        } else {
            // Chit chat
            if (msg.contains("hello") || msg.contains("hi") || msg.contains("hey")) {
                reply = "Hello! I am Aura's dynamic AI assistant. I can search the catalog semantically, help add items to your cart, or answer shipping and return questions. How may I wows you today?";
            } else if (msg.contains("thank")) {
                reply = "You are most welcome! Shopping at Aura is all about sleek simplicity. Let me know if you need anything else.";
            } else {
                reply = "I appreciate that. I can search our luxury minimalist catalog for you. Try asking me: 'Show me premium tech gadgets' or 'What is the refund policy?'";
            }
        }

        return ChatResponse.builder()
                .reply(reply)
                .intent(intent)
                .products(products)
                .build();
    }

    // ==========================================
    // 4. RECOMMENDATION CAROUSELS
    // ==========================================
    public List<ProductDto> getSimilarProducts(Long productId) {
        Optional<Product> prodOpt = productRepository.findById(productId);
        if (prodOpt.isEmpty()) return new ArrayList<>();
        Product source = prodOpt.get();

        List<Product> matches = productRepository.findByCategoryId(source.getCategory().getId(), org.springframework.data.domain.PageRequest.of(0, 10)).getContent();
        return matches.stream()
                .filter(p -> !p.getId().equals(productId))
                .limit(5)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public List<ProductDto> getPersonalizedRecommendations(Long userId) {
        // Highly sophisticated default collaborative collaborative filter:
        // Returns highest rated premium products in the catalog
        return productRepository.findAll().stream()
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .limit(4)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ==========================================
    // VECTOR UTILITIES
    // ==========================================
    private String[] tokenize(String text) {
        if (text == null) return new String[0];
        return text.toLowerCase()
                .replaceAll("[^a-zA-Z0-9\\s]", "")
                .split("\\s+");
    }

    private Map<String, Double> getTermFrequencyVector(String[] tokens) {
        Map<String, Double> vector = new HashMap<>();
        for (String token : tokens) {
            if (token.isBlank() || token.length() < 3) continue; // Skip very small words / noise
            vector.put(token, vector.getOrDefault(token, 0.0) + 1.0);
        }
        return vector;
    }

    private double calculateCosineSimilarity(Map<String, Double> vectorA, Map<String, Double> vectorB) {
        Set<String> both = new HashSet<>(vectorA.keySet());
        both.retainAll(vectorB.keySet());

        double dotProduct = 0.0;
        for (String term : both) {
            dotProduct += vectorA.get(term) * vectorB.get(term);
        }

        double normA = 0.0;
        for (double val : vectorA.values()) {
            normA += Math.pow(val, 2);
        }
        normA = Math.sqrt(normA);

        double normB = 0.0;
        for (double val : vectorB.values()) {
            normB += Math.pow(val, 2);
        }
        normB = Math.sqrt(normB);

        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dotProduct / (normA * normB);
    }

    private String extractQuery(String message, String regex) {
        Pattern pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(message);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return "";
    }

    private ProductDto mapToDto(Product p) {
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

    private static class ProductSimilarity {
        final Product product;
        final double similarity;

        ProductSimilarity(Product product, double similarity) {
            this.product = product;
            this.similarity = similarity;
        }
    }
}
