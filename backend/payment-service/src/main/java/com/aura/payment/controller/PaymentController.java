package com.aura.payment.controller;

import com.aura.payment.model.Transaction;
import com.aura.payment.service.PaymentService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/checkout")
    public ResponseEntity<Transaction> executeCheckout(@RequestBody PaymentRequest request) {
        Transaction transaction = paymentService.processPayment(
                request.getOrderId(),
                request.getUserId(),
                request.getAmount(),
                request.getPaymentMethod()
        );
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Transaction> getTransactionByOrder(@PathVariable Long orderId) {
        Transaction transaction = paymentService.getTransactionByOrderId(orderId);
        return ResponseEntity.ok(transaction);
    }

    // Requests Helper Format
    @Data
    public static class PaymentRequest {
        private Long orderId;
        private Long userId;
        private double amount;
        private String paymentMethod;
    }
}
