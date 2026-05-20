package com.aura.payment.service;

import com.aura.payment.model.Transaction;
import com.aura.payment.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final TransactionRepository transactionRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public Transaction processPayment(Long orderId, Long userId, double amount, String method) {
        // Stripe Checkout API simulation
        String stripeTrackingId = "ch_stripe_" + UUID.randomUUID().toString().replaceAll("-", "").substring(0, 16);

        Transaction transaction = Transaction.builder()
                .orderId(orderId)
                .userId(userId)
                .amount(amount)
                .status("SUCCESS")
                .trackingId(stripeTrackingId)
                .paymentMethod(method != null ? method.toUpperCase() : "CARD")
                .timestamp(Instant.now())
                .build();

        Transaction savedTx = transactionRepository.save(transaction);

        // Emit payment event to notify Order Service asynchronously!
        Map<String, Object> event = new HashMap<>();
        event.put("orderId", savedTx.getOrderId());
        event.put("userId", savedTx.getUserId());
        event.put("type", "PAYMENT_SUCCESS");
        event.put("amount", savedTx.getAmount());
        event.put("trackingId", savedTx.getTrackingId());

        try {
            kafkaTemplate.send("payment-events", savedTx.getOrderId().toString(), event);
        } catch (Exception e) {
            System.err.println("Kafka broker offline, caching payment transaction state: " + e.getMessage());
        }

        return savedTx;
    }

    public Transaction getTransactionByOrderId(Long orderId) {
        return transactionRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Payment transaction details not found for order: " + orderId));
    }
}
