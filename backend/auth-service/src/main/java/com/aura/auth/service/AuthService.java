package com.aura.auth.service;

import com.aura.auth.event.UserCreatedEvent;
import com.aura.auth.model.RefreshToken;
import com.aura.auth.model.User;
import com.aura.auth.repository.RefreshTokenRepository;
import com.aura.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TotpService totpService;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpirationMs;

    @Transactional
    public User register(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email address is already in use.");
        }

        // Auto assign ADMIN role to developer email
        String roles = email.toLowerCase().contains("admin") ? "ROLE_USER,ROLE_ADMIN" : "ROLE_USER";

        // Generate 6-digit OTP
        String otp = String.format("%06d", new Random().nextInt(999999));

        User user = User.builder()
                .name(name)
                .email(email)
                .password(passwordEncoder.encode(password))
                .roles(roles)
                .enabled(false)
                .verificationCode(otp)
                .twoFactorEnabled(false)
                .loyaltyPoints(100) // Seeding 100 welcome reward points ($10 value!)
                .build();

        User savedUser = userRepository.save(user);

        // Developer OTP bypass: Output OTP to stdout console instantly!
        System.out.println("==================================================================");
        System.out.println("AURA SIGNUP SECURITY BYPASS VERIFICATION CODE FOR " + email.toUpperCase());
        System.out.println("ACTIVATION OTP CODE: " + otp);
        System.out.println("==================================================================");

        // Dispatch Kafka event
        UserCreatedEvent event = UserCreatedEvent.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .roles(savedUser.getRoles())
                .build();
        try {
            kafkaTemplate.send("auth-events", savedUser.getEmail(), event);
        } catch (Exception e) {
            System.err.println("Kafka unavailable, skipping account streaming synchronization: " + e.getMessage());
        }

        return savedUser;
    }

    @Transactional
    public boolean verifyEmail(String otp) {
        Optional<User> userOpt = userRepository.findByVerificationCode(otp);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEnabled(true);
            user.setVerificationCode(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Incorrect email or password credentials."));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Incorrect email or password credentials.");
        }

        if (!user.isEnabled()) {
            throw new RuntimeException("User account is not verified. Please activate your profile using the OTP code sent to your console.");
        }

        Map<String, Object> response = new HashMap<>();
        if (user.isTwoFactorEnabled()) {
            response.put("requires2fa", true);
            response.put("email", user.getEmail());
            return response;
        }

        response.put("requires2fa", false);
        response.put("accessToken", jwtService.generateAccessToken(user.getEmail(), user.getId(), user.getRoles(), false));
        response.put("refreshToken", createRefreshToken(user).getToken());
        response.put("user", user);
        return response;
    }

    @Transactional
    public Map<String, String> setup2Fa(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        String secret = totpService.generateSecret();
        user.setTwoFactorSecret(secret);
        userRepository.save(user);

        Map<String, String> result = new HashMap<>();
        result.put("secret", secret);
        result.put("qrCodeUrl", totpService.getQrCodeUrl(secret, user.getEmail()));
        return result;
    }

    @Transactional
    public boolean verify2FaSetup(String email, int code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        if (user.getTwoFactorSecret() != null && totpService.verifyCode(user.getTwoFactorSecret(), code)) {
            user.setTwoFactorEnabled(true);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Transactional
    public Map<String, Object> validate2FaLogin(String email, int code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User profile not found."));

        if (!totpService.verifyCode(user.getTwoFactorSecret(), code)) {
            throw new RuntimeException("Invalid two-factor authentication security code.");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", jwtService.generateAccessToken(user.getEmail(), user.getId(), user.getRoles(), true));
        response.put("refreshToken", createRefreshToken(user).getToken());
        response.put("user", user);
        return response;
    }

    @Transactional
    public RefreshToken createRefreshToken(User user) {
        // Evict previous user tokens to keep sessions clean
        refreshTokenRepository.deleteByUser(user);

        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshExpirationMs))
                .build();

        return refreshTokenRepository.save(token);
    }

    @Transactional
    public Map<String, Object> refreshAccessToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired session refresh token."));

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new RuntimeException("Session refresh token expired. Please login again.");
        }

        User user = refreshToken.getUser();
        String newAccessToken = jwtService.generateAccessToken(user.getEmail(), user.getId(), user.getRoles(), user.isTwoFactorEnabled());
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("refreshToken", token);
        return response;
    }
}
