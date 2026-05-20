package com.aura.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double discountPercentage;
    private Integer stockQuantity;
    private String imageUrl;
    private Double rating;
    private Integer reviewCount;
    private String tags;
    private Long categoryId;
    private String categoryName;
}
