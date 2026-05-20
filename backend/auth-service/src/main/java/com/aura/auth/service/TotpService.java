package com.aura.auth.service;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.GeneralSecurityException;
import java.security.SecureRandom;
import java.util.Arrays;

@Service
public class TotpService {

    private static final int TIME_STEP = 30; // 30 seconds interval
    private static final int CODE_LENGTH = 6;
    private static final int SKEW_WINDOW = 1; // Tolerance windows (+/- 30s)

    // Generate base32 secret key (16 characters)
    public String generateSecret() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[10];
        random.nextBytes(bytes);
        return encodeBase32(bytes);
    }

    // Generate Google Authenticator compatible provisioning URL
    public String getQrCodeUrl(String secret, String email) {
        return "otpauth://totp/Aura:" + email + "?secret=" + secret + "&issuer=Aura";
    }

    // Verify user inputted TOTP code
    public boolean verifyCode(String secret, int code) {
        try {
            byte[] decodedKey = decodeBase32(secret);
            long currentTime = System.currentTimeMillis() / 1000;
            long currentStep = currentTime / TIME_STEP;

            for (int i = -SKEW_WINDOW; i <= SKEW_WINDOW; i++) {
                if (generateTotpCode(decodedKey, currentStep + i) == code) {
                    return true;
                }
            }
        } catch (Exception e) {
            // Ignore format errors
        }
        return false;
    }

    private int generateTotpCode(byte[] key, long timeStep) throws GeneralSecurityException {
        byte[] data = new byte[8];
        long val = timeStep;
        for (int i = 7; i >= 0; i--) {
            data[i] = (byte) (val & 0xFF);
            val >>= 8;
        }

        SecretKeySpec signKey = new SecretKeySpec(key, "HmacSHA1");
        Mac mac = Mac.getInstance("HmacSHA1");
        mac.init(signKey);
        byte[] hash = mac.doFinal(data);

        int offset = hash[hash.length - 1] & 0xF;
        long truncatedHash = 0;
        for (int i = 0; i < 4; ++i) {
            truncatedHash <<= 8;
            truncatedHash |= (hash[offset + i] & 0xFF);
        }

        truncatedHash &= 0x7FFFFFFF;
        truncatedHash %= Math.pow(10, CODE_LENGTH);

        return (int) truncatedHash;
    }

    // Helper: Base32 Encoding in pure Java
    private String encodeBase32(byte[] bytes) {
        String base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        StringBuilder sb = new StringBuilder((bytes.length * 8 + 4) / 5);
        int val = 0;
        int count = 0;
        for (byte b : bytes) {
            val = (val << 8) | (b & 0xFF);
            count += 8;
            while (count >= 5) {
                sb.append(base32Chars.charAt((val >> (count - 5)) & 0x1F));
                count -= 5;
            }
        }
        if (count > 0) {
            sb.append(base32Chars.charAt((val << (5 - count)) & 0x1F));
        }
        return sb.toString();
    }

    // Helper: Base32 Decoding in pure Java
    private byte[] decodeBase32(String base32) {
        String base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        base32 = base32.toUpperCase().replaceAll("[^A-Z2-7]", "");
        int val = 0;
        int count = 0;
        byte[] bytes = new byte[base32.length() * 5 / 8];
        int index = 0;
        for (int i = 0; i < base32.length(); i++) {
            int charVal = base32Chars.indexOf(base32.charAt(i));
            val = (val << 5) | charVal;
            count += 5;
            if (count >= 8) {
                bytes[index++] = (byte) ((val >> (count - 8)) & 0xFF);
                count -= 8;
            }
        }
        return Arrays.copyOf(bytes, index);
    }
}
