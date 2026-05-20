package com.aura.product.dto;

import com.aura.product.model.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponse {
    private String reply;
    private String intent; // "SEARCH", "HELP", "CHITCHAT", "CART_ADD", "DETAILS"
    private List<Product> products; // Core product structures returned directly
}
