package com.aura.auth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String roles; // e.g. "ROLE_USER" or "ROLE_USER,ROLE_ADMIN"

    private boolean enabled = false;

    // Time-based 2FA parameters
    private boolean twoFactorEnabled = false;
    private String twoFactorSecret;

    private int loyaltyPoints = 0;
    
    private String verificationCode; // OTP Code for email activation
    private String passwordResetToken;
}
