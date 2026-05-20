package com.aura.analytics.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "daily_sales")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailySales {

    @Id
    private String id; // Date string: "YYYY-MM-DD"

    private double revenue;
    private int ordersCount;
}
