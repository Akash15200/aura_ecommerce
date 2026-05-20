package com.aura.notification.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final SimpMessagingTemplate messagingTemplate;

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> broadcastTestAlert(@RequestParam String message) {
        Map<String, Object> alert = new HashMap<>();
        alert.put("title", "Aura Broadcast System");
        alert.put("message", message);
        alert.put("timestamp", System.currentTimeMillis());
        alert.put("type", "TEST");

        messagingTemplate.convertAndSend("/topic/alerts", alert);

        Map<String, String> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "Simulated alert broadcast to WebSocket channel /topic/alerts successfully.");
        return ResponseEntity.ok(response);
    }
}
