package com.aura.analytics.service;

import com.aura.analytics.model.DailySales;
import com.aura.analytics.repository.DailySalesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final DailySalesRepository salesRepository;
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    // Kafka Listener: captures checkout transactions to accumulate daily aggregates
    @KafkaListener(topics = "order-events", groupId = "analytics-group")
    @Transactional
    public void listenCheckoutTransactions(Map<String, Object> payload) {
        try {
            double finalAmount = Double.parseDouble(payload.get("finalAmount").toString());
            String todayStr = DATE_FORMAT.format(new Date());

            DailySales sales = salesRepository.findById(todayStr)
                    .orElse(DailySales.builder().id(todayStr).revenue(0.0).ordersCount(0).build());

            sales.setRevenue(sales.getRevenue() + finalAmount);
            sales.setOrdersCount(sales.getOrdersCount() + 1);

            salesRepository.save(sales);
            System.out.println("KAFKA ANALYTICS LOGGER: Incremented sales aggregates for Date: " + todayStr);
        } catch (Exception e) {
            System.err.println("Analytics checkout logs processing failed: " + e.getMessage());
        }
    }

    public List<DailySales> getSalesHistory() {
        List<DailySales> history = salesRepository.findAll();
        
        // Seed 30-day upward growth trajectory curve if empty
        if (history.size() < 10) {
            history = seedSimulatedHistoricalSales();
        }
        
        history.sort(Comparator.comparing(DailySales::getId));
        return history;
    }

    // AI Linear Regression revenue forecasting
    public Map<String, Object> forecastNextMonthRevenue() {
        List<DailySales> history = getSalesHistory();
        int n = history.size();

        double[] x = new double[n];
        double[] y = new double[n];

        for (int i = 0; i < n; i++) {
            x[i] = i + 1.0;
            y[i] = history.get(i).getRevenue();
        }

        // Calculate Means
        double sumX = 0.0;
        double sumY = 0.0;
        for (int i = 0; i < n; i++) {
            sumX += x[i];
            sumY += y[i];
        }
        double meanX = sumX / n;
        double meanY = sumY / n;

        // Calculate Slope (m) and Intercept (c) -> y = mx + c
        double num = 0.0;
        double den = 0.0;
        for (int i = 0; i < n; i++) {
            num += (x[i] - meanX) * (y[i] - meanY);
            den += (x[i] - meanX) * (x[i] - meanX);
        }

        double slope = den != 0.0 ? num / den : 0.0;
        double intercept = meanY - slope * meanX;

        // Generate next 30 days predictions
        List<Map<String, Object>> forecastPoints = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        
        // Find latest date in history to continue from
        try {
            Date latestDate = DATE_FORMAT.parse(history.get(n - 1).getId());
            cal.setTime(latestDate);
        } catch (Exception e) {
            cal.setTime(new Date());
        }

        double forecastedRevenueAccumulated = 0.0;
        for (int i = 1; i <= 30; i++) {
            cal.add(Calendar.DAY_OF_MONTH, 1);
            String dateStr = DATE_FORMAT.format(cal.getTime());
            
            double targetX = n + i;
            double predictedVal = Math.max(100.0, (slope * targetX) + intercept); // Prevent negative forecasts
            forecastedRevenueAccumulated += predictedVal;

            Map<String, Object> point = new HashMap<>();
            point.put("date", dateStr);
            point.put("predictedRevenue", predictedVal);
            forecastPoints.add(point);
        }

        // Compute R-squared evaluation metric
        double totalSumSquares = 0.0;
        double residualSumSquares = 0.0;
        for (int i = 0; i < n; i++) {
            double fittedVal = (slope * x[i]) + intercept;
            totalSumSquares += (y[i] - meanY) * (y[i] - meanY);
            residualSumSquares += (y[i] - fittedVal) * (y[i] - fittedVal);
        }
        double rSquared = totalSumSquares > 0.0 ? 1.0 - (residualSumSquares / totalSumSquares) : 1.0;

        Map<String, Object> result = new HashMap<>();
        result.put("forecastPoints", forecastPoints);
        result.put("predictedNextMonthGross", forecastedRevenueAccumulated);
        result.put("regressionSlope", slope);
        result.put("regressionIntercept", intercept);
        result.put("rSquaredAccuracy", rSquared);
        result.put("evaluationLabel", rSquared > 0.8 ? "EXCELLENT" : "MODERATE");

        return result;
    }

    private List<DailySales> seedSimulatedHistoricalSales() {
        List<DailySales> list = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -30);

        double baseRevenue = 2500.0;
        Random random = new Random();

        for (int i = 1; i <= 30; i++) {
            String dateStr = DATE_FORMAT.format(cal.getTime());
            // Project upward growth trajectory: base increases by $150 each day + noise
            double dailyNoise = random.nextDouble() * 1000.0 - 300.0; // Random fluctuations
            double revenue = baseRevenue + (i * 180.0) + dailyNoise;
            int orders = (int) (revenue / 150.0);

            DailySales sales = DailySales.builder()
                    .id(dateStr)
                    .revenue(revenue)
                    .ordersCount(orders)
                    .build();

            try {
                salesRepository.save(sales);
            } catch (Exception e) {
                // Ignore Mongo save during mocks
            }
            list.add(sales);
            cal.add(Calendar.DAY_OF_MONTH, 1);
        }
        return list;
    }
}
