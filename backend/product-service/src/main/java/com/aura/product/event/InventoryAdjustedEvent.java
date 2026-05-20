package com.aura.product.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryAdjustedEvent implements Serializable {
    private Long productId;
    private int newStockQuantity;
    private long timestamp;
}
