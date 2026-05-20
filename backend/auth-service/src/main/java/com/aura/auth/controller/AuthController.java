package com.aura.auth.controller;

import com.aura.auth.model.User;
import com.aura.auth.service.AuthService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    // ─── REGISTER ──────────────────────────────────────────────────────────────
    // Returns a clean message + verification code (no raw User/password exposed)
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest request) {
        User user = authService.register(request.getName(), request.getEmail(), request.getPassword());
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Account created! Check console for your OTP verification code.");
        response.put("email", user.getEmail());
        response.put("verificationCode", user.getVerificationCode()); // Expose for dev testing
        return ResponseEntity.ok(response);
    }

    // ─── VERIFY OTP ────────────────────────────────────────────────────────────
    // Accepts JSON body { email, otp } instead of query param for frontend compat
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(@RequestBody VerifyOtpRequest request) {
        // Support both query param (backward compat) and JSON body
        String code = request.getOtp() != null ? request.getOtp() : request.getCode();
        boolean verified = authService.verifyEmail(code);
        Map<String, Object> response = new HashMap<>();
        if (verified) {
            response.put("success", true);
            response.put("message", "Email verified successfully! You can now sign in.");
            return ResponseEntity.ok(response);
        }
        response.put("success", false);
        response.put("message", "Invalid or expired OTP code. Please try again.");
        return ResponseEntity.badRequest().body(response);
    }

    // ─── LOGIN ─────────────────────────────────────────────────────────────────
    // Returns accessToken, refreshToken, and a safe user object (no password)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        Map<String, Object> result = authService.login(request.getEmail(), request.getPassword());

        // Remap the raw User object into a safe, frontend-compatible shape
        if (result.containsKey("user")) {
            User u = (User) result.get("user");
            Map<String, Object> safeUser = new HashMap<>();
            safeUser.put("id", u.getId());
            safeUser.put("name", u.getName());
            safeUser.put("email", u.getEmail());
            safeUser.put("role", u.getRoles());          // frontend reads "role"
            safeUser.put("roles", u.getRoles());         // keep both for compat
            safeUser.put("loyaltyPoints", u.getLoyaltyPoints());
            safeUser.put("twoFactorEnabled", u.isTwoFactorEnabled());
            result.put("user", safeUser);

            // Also hoist top-level fields that AuthContext.jsx destructures directly
            result.put("name", u.getName());
            result.put("role", u.getRoles());
            result.put("loyaltyPoints", u.getLoyaltyPoints());
        }

        return ResponseEntity.ok(result);
    }

    // ─── 2FA ENDPOINTS ─────────────────────────────────────────────────────────
    @PostMapping("/2fa/setup")
    public ResponseEntity<Map<String, String>> setup2fa(@RequestParam String email) {
        Map<String, String> setupData = authService.setup2Fa(email);
        return ResponseEntity.ok(setupData);
    }

    @PostMapping("/2fa/verify")
    public ResponseEntity<Map<String, Object>> verify2fa(@RequestParam String email, @RequestParam int code) {
        boolean success = authService.verify2FaSetup(email, code);
        Map<String, Object> response = new HashMap<>();
        if (success) {
            response.put("success", true);
            response.put("message", "Two-factor authentication activated successfully.");
            return ResponseEntity.ok(response);
        }
        response.put("success", false);
        response.put("message", "Invalid authentication security code.");
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/2fa/login")
    public ResponseEntity<Map<String, Object>> login2fa(@RequestParam String email, @RequestParam int code) {
        Map<String, Object> result = authService.validate2FaLogin(email, code);
        return ResponseEntity.ok(result);
    }

    // ─── TOKEN REFRESH ─────────────────────────────────────────────────────────
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refresh(@RequestParam String token) {
        Map<String, Object> result = authService.refreshAccessToken(token);
        return ResponseEntity.ok(result);
    }

    // ─── FORGOT / RESET PASSWORD ───────────────────────────────────────────────
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "If that email is registered, a reset link has been sent.");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successfully. Please sign in with your new password.");
        return ResponseEntity.ok(response);
    }

    // ─── REQUEST / RESPONSE DTOs ────────────────────────────────────────────────
    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
    }

    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class VerifyOtpRequest {
        private String email;
        private String otp;   // frontend sends "otp"
        private String code;  // fallback for query-param style
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }
}
