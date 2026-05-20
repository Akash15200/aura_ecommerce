package com.aura.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.filter.ratelimit.KeyResolver;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@EnableDiscoveryClient
@RestController
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    // Reactive Redis Rate Limiter Key Resolver based on Client IP Address
    @Bean
    public KeyResolver ipKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getRemoteAddress() != null 
                ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress() 
                : "anonymous"
        );
    }

    // Gateway Fallback mappings for Circuit Breakers
    @RequestMapping("/fallback/product")
    public Mono<ResponseEntity<Map<String, Object>>> productServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Service Unavailable");
        response.put("message", "Aura Product catalog is currently refreshing. Please stand by.");
        response.put("code", 503);
        return Mono.just(new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE));
    }

    @RequestMapping("/fallback/order")
    public Mono<ResponseEntity<Map<String, Object>>> orderServiceFallback() {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Service Unavailable");
        response.put("message", "Aura checkout ledger is busy. Please try processing payment again shortly.");
        response.put("code", 503);
        return Mono.just(new ResponseEntity<>(response, HttpStatus.SERVICE_UNAVAILABLE));
    }
}
