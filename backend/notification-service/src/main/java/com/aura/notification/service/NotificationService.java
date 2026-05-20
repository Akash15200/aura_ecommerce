package com.aura.notification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    // 1. Listen for new checkout orders placed
    @KafkaListener(topics = "order-events", groupId = "notification-group")
    public void handleOrderEvent(Map<String, Object> payload) {
        String orderId = payload.get("orderId").toString();
        String amount = payload.get("finalAmount").toString();

        Map<String, Object> alert = new HashMap<>();
        alert.put("title", "Aura Transaction Initiated");
        alert.put("message", "A new luxury purchase transaction worth $" + amount + " has completed! Order ID: #" + orderId);
        alert.put("timestamp", System.currentTimeMillis());
        alert.put("type", "ORDER");

        // Broadcast to clients via WebSocket
        messagingTemplate.convertAndSend("/topic/alerts", alert);
        System.out.println("WEBSOCKET BROADCASTER: Sent order update for #" + orderId);
    }

    // 2. Listen for stock updates
    @KafkaListener(topics = "inventory-events", groupId = "notification-group")
    public void handleInventoryEvent(Map<String, Object> payload) {
        String productId = payload.get("productId").toString();
        String stock = payload.get("newStockQuantity").toString();

        Map<String, Object> alert = new HashMap<>();
        alert.put("title", "Aura Inventory Alert");
        alert.put("message", "Stock levels modified for Product #" + productId + ". Current inventory limits: " + stock + " items remaining.");
        alert.put("timestamp", System.currentTimeMillis());
        alert.put("type", "INVENTORY");

        messagingTemplate.convertAndSend("/topic/alerts", alert);
        System.out.println("WEBSOCKET BROADCASTER: Sent stock levels alert for product #" + productId);
    }

    // 3. Listen for customer ratings
    @KafkaListener(topics = "review-events", groupId = "notification-group")
    public void handleReviewEvent(Map<String, Object> payload) {
        String productId = payload.get("productId").toString();
        String rating = payload.get("rating").toString();
        String sentiment = payload.get("sentiment").toString();

        Map<String, Object> alert = new HashMap<>();
        alert.put("title", "Aura Review Submitted");
        alert.put("message", "A new customer feedback score of " + rating + " stars was scored! AI Sentiment Analysis: " + sentiment);
        alert.put("timestamp", System.currentTimeMillis());
        alert.put("type", "REVIEW");

        messagingTemplate.convertAndSend("/topic/alerts", alert);
        System.out.println("WEBSOCKET BROADCASTER: Sent review sentiment update for product #" + productId);
    }

    // 4. Listen for payment events
    @KafkaListener(topics = "payment-events", groupId = "notification-group")
    public void handlePaymentEvent(Map<String, Object> payload) {
        String orderId = payload.get("orderId").toString();
        String trackingId = payload.get("trackingId").toString();

        Map<String, Object> alert = new HashMap<>();
        alert.put("title", "Stripe Charge Succeeded");
        alert.put("message", "Payment authorized successfully for Order #" + orderId + "! Stripe Tracking ID: " + trackingId);
        alert.put("timestamp", System.currentTimeMillis());
        alert.put("type", "PAYMENT");

        messagingTemplate.convertAndSend("/topic/alerts", alert);
        System.out.println("WEBSOCKET BROADCASTER: Sent payment charge notice for order #" + orderId);
    }
}
