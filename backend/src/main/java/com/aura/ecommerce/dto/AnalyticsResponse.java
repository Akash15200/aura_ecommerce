package com.aura.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    private Double totalSales;
    private Long totalOrders;
    private Long totalProducts;
    private Long totalUsers;
    private List<Double> monthlyRevenue; // Sales levels for charts
    private List<String> months; // Labels for charts
    private List<ProductDto> topSellingProducts;
    private Double predictedNextMonthRevenue; // AI forecasting logic response
}
