package com.aura.ecommerce.service;

import com.aura.ecommerce.config.JwtService;
import com.aura.ecommerce.dto.*;
import com.aura.ecommerce.entity.RefreshToken;
import com.aura.ecommerce.entity.User;
import com.aura.ecommerce.exception.ResourceNotFoundException;
import com.aura.ecommerce.repository.RefreshTokenRepository;
import com.aura.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final long REFRESH_TOKEN_EXPIRY_DAYS = 7;

    // ==========================================
    // 1. REGISTRATION
    // ==========================================
    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email address is already in use");
        }

        // Set role based on email pattern (for easy testing of admin dashboard!)
        String role = "ROLE_USER";
        if (request.getEmail().toLowerCase().contains("admin")) {
            role = "ROLE_ADMIN";
        }

        // Generate dynamic 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isEnabled(false)
                .otpSecret(otp)
                .otpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .loyaltyPoints(100) // 100 free signing loyalty points!
                .provider("LOCAL")
                .build();

        userRepository.save(user);
        emailService.sendVerificationOtp(user.getEmail(), otp);

        return "User registered successfully. An OTP verification code has been dispatched.";
    }

    // ==========================================
    // 2. OTP VERIFICATION
    // ==========================================
    @Transactional
    public String verifyOtp(VerifyOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No user found with email " + request.getEmail()));

        if (user.getIsEnabled()) {
            return "Account is already verified.";
        }

        if (user.getOtpSecret() == null || !user.getOtpSecret().equals(request.getOtp())) {
            throw new IllegalArgumentException("Invalid verification OTP code.");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired.");
        }

        user.setIsEnabled(true);
        user.setOtpSecret(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return "Account successfully verified! You may now sign in.";
    }

    // ==========================================
    // 3. AUTHENTICATION (LOGIN)
    // ==========================================
    @Transactional
    public AuthResponse authenticate(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("No account registered under " + request.getEmail()));

        if (!user.getIsEnabled()) {
            throw new IllegalArgumentException("Account has not been verified yet. Please verify using OTP.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String jwtToken = jwtService.generateToken(user);
        
        // Revoke existing refresh tokens before generating a new one
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken.getToken())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .loyaltyPoints(user.getLoyaltyPoints())
                .build();
    }

    // ==========================================
    // 4. REFRESH TOKEN LIFECYCLE
    // ==========================================
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusSeconds(REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new IllegalArgumentException("Refresh token was expired. Please make a new sign in request");
        }
        return token;
    }

    @Transactional
    public AuthResponse refreshAccessToken(String requestRefreshToken) {
        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    return AuthResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(requestRefreshToken)
                            .email(user.getEmail())
                            .name(user.getName())
                            .role(user.getRole())
                            .loyaltyPoints(user.getLoyaltyPoints())
                            .build();
                })
                .orElseThrow(() -> new ResourceNotFoundException("Refresh token is not in database!"));
    }

    // ==========================================
    // 5. FORGOT PASSWORD & RESET FLOWS
    // ==========================================
    @Transactional
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No account registered under " + request.getEmail()));

        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15)); // Reset token valid for 15 mins
        userRepository.save(user);

        emailService.sendPasswordResetToken(user.getEmail(), token);
        return "Password reset token sent to your email.";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Invalid password reset token."));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Password reset token has expired.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password has been successfully updated!";
    }
}
