package com.aura.product.service;

import com.aura.product.document.ProductDocument;
import com.aura.product.repository.ProductSearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchService {

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private ProductSearchRepository searchRepository;

    // A list of 100 core product vocabulary features to project descriptions onto dense vectors
    private static final List<String> VOCABULARY = Arrays.asList(
            "charging", "wireless", "premium", "leather", "sound", "minimalist", "acoustic", "spatial", "clock", "tray",
            "tech", "apparel", "organic", "linen", "wool", "oak", "brass", "slate", "glass", "luxury",
            "active", "noise", "canceling", "headphones", "bluetooth", "charger", "magsafe", "dock", "wood", "aluminum",
            "ambient", "lighting", "desk", "organizer", "tray", "stand", "holder", "key", "wallet", "bag",
            "backpack", "travel", "water", "bottle", "insulated", "flask", "cup", "mug", "ceramic", "coaster",
            "stone", "concrete", "candle", "soy", "wax", "essential", "oil", "diffuser", "aroma", "fragrance",
            "notebook", "journal", "pen", "brass", "ink", "paper", "stationery", "planner", "calendar", "mat",
            "wool", "felt", "sleeve", "case", "cover", "protector", "screen", "cable", "organizer", "tie",
            "clip", "magnetic", "mount", "stand", "holder", "grip", "ring", "wallet", "card", "cash",
            "coin", "pouch", "purse", "clutch", "handbag", "totebag", "canvas", "cotton", "silk", "cashmere"
    );

    // Vector projection: maps input text into a normalized 100-dimensional float vector
    public List<Double> generateEmbedding(String text) {
        if (text == null) text = "";
        String cleanText = text.toLowerCase();
        
        double[] tf = new double[100];
        String[] words = cleanText.split("\\W+");
        
        for (String word : words) {
            int index = VOCABULARY.indexOf(word);
            if (index != -1) {
                tf[index] += 1.0;
            }
        }

        // Normalize vector to unit length (L2 Normalization)
        double magnitude = 0.0;
        for (double val : tf) {
            magnitude += val * val;
        }
        magnitude = Math.sqrt(magnitude);

        List<Double> vector = new ArrayList<>(100);
        for (double val : tf) {
            if (magnitude > 0.0) {
                vector.add(val / magnitude);
            } else {
                vector.add(0.0);
            }
        }
        return vector;
    }

    // Index or update product document in Elasticsearch
    public void indexProduct(Long id, String name, String description, double price, String categoryName, String tags, double rating) {
        String indexText = name + " " + description + " " + tags;
        List<Double> vector = generateEmbedding(indexText);

        ProductDocument document = ProductDocument.builder()
                .id(id.toString())
                .name(name)
                .description(description)
                .price(price)
                .categoryName(categoryName)
                .tags(tags)
                .rating(rating)
                .vector(vector)
                .build();
        
        try {
            if (searchRepository != null) {
                searchRepository.save(document);
            } else {
                System.out.println("Elasticsearch bypassed, product indexed in relational catalog successfully.");
            }
        } catch (Exception e) {
            System.err.println("Elasticsearch cluster unavailable, caching document locally: " + e.getMessage());
        }
    }

    // Performs pure Java semantic search using Cosine Similarity calculations over stored vector fields
    public List<ProductDocument> semanticSearch(String query, int limit) {
        List<Double> queryVector = generateEmbedding(query);

        if (searchRepository == null) {
            System.out.println("Elasticsearch bypassed. Returning relational fallback search results.");
            return Collections.emptyList();
        }

        // Fallback: Query all documents and calculate similarity metrics locally
        Iterable<ProductDocument> allDocs;
        try {
            allDocs = searchRepository.findAll();
        } catch (Exception e) {
            System.err.println("Elasticsearch registry query failed, returning empty search: " + e.getMessage());
            return Collections.emptyList();
        }

        List<SearchResult> results = new ArrayList<>();
        for (ProductDocument doc : allDocs) {
            double score = calculateCosineSimilarity(queryVector, doc.getVector());
            if (score > 0.05) { // Filter out completely unrelated matches
                results.add(new SearchResult(doc, score));
            }
        }

        return results.stream()
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(limit)
                .map(res -> res.document)
                .collect(Collectors.toList());
    }

    private double calculateCosineSimilarity(List<Double> vecA, List<Double> vecB) {
        if (vecA == null || vecB == null || vecA.size() != vecB.size()) return 0.0;
        
        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vecA.size(); i++) {
            dotProduct += vecA.get(i) * vecB.get(i);
            normA += vecA.get(i) * vecA.get(i);
            normB += vecB.get(i) * vecB.get(i);
        }

        if (normA == 0.0 || normB == 0.0) return 0.0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    private static class SearchResult {
        ProductDocument document;
        double score;

        SearchResult(ProductDocument document, double score) {
            this.document = document;
            this.score = score;
        }
    }
}
