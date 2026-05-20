package com.aura.ecommerce.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    public void sendVerificationOtp(String email, String otp) {
        log.info("\n" +
                "==========================================================\n" +
                "               AURA SIMULATED MAIL OUTBOX                 \n" +
                "==========================================================\n" +
                "To: " + email + "\n" +
                "Subject: Verify Your Aura Account\n" +
                "Body:\n" +
                "  Thank you for registering at Aura! \n" +
                "  Please use the verification OTP code below to unlock: \n" +
                "\n" +
                "                 >>>  " + otp + "  <<<\n" +
                "\n" +
                "  This code expires in 5 minutes.\n" +
                "==========================================================\n");
    }

    public void sendPasswordResetToken(String email, String token) {
        log.info("\n" +
                "==========================================================\n" +
                "               AURA SIMULATED MAIL OUTBOX                 \n" +
                "==========================================================\n" +
                "To: " + email + "\n" +
                "Subject: Reset Your Aura Password\n" +
                "Body:\n" +
                "  We received a request to recover your account password.\n" +
                "  Please use the recovery token below to reset your details:\n" +
                "\n" +
                "                 >>>  " + token + "  <<<\n" +
                "\n" +
                "  Paste this token inside the verification portal to proceed.\n" +
                "==========================================================\n");
    }
}
