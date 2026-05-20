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
public class ChatResponse {
    private String reply;
    private String intent; // "SEARCH", "HELP", "CHITCHAT", "CART_ADD", "DETAILS"
    private List<ProductDto> products; // Optional context-relevant items returned by the AI
}
