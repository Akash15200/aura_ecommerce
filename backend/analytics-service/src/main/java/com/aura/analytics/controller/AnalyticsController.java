package com.aura.analytics.controller;

import com.aura.analytics.model.DailySales;
import com.aura.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/analytics/history")
    public ResponseEntity<List<DailySales>> getDailySalesHistory() {
        List<DailySales> history = analyticsService.getSalesHistory();
        return ResponseEntity.ok(history);
    }

    @GetMapping("/forecast/revenue")
    public ResponseEntity<Map<String, Object>> getGrossRevenueForecast() {
        Map<String, Object> forecast = analyticsService.forecastNextMonthRevenue();
        return ResponseEntity.ok(forecast);
    }
}
