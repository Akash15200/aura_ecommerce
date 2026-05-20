package com.aura.auth.service;

import com.aura.auth.event.UserCreatedEvent;
import com.aura.auth.model.User;
import com.aura.auth.repository.RefreshTokenRepository;
import com.aura.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private TotpService totpService;

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "refreshExpirationMs", 604800000L);
    }

    @Test
    void register_Success() {
        String name = "John Doe";
        String email = "john@example.com";
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";

        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            return User.builder()
                    .id(1L)
                    .name(user.getName())
                    .email(user.getEmail())
                    .password(user.getPassword())
                    .roles(user.getRoles())
                    .enabled(user.isEnabled())
                    .verificationCode(user.getVerificationCode())
                    .loyaltyPoints(user.getLoyaltyPoints())
                    .build();
        });

        User registeredUser = authService.register(name, email, rawPassword);

        assertNotNull(registeredUser);
        assertEquals(1L, registeredUser.getId());
        assertEquals(name, registeredUser.getName());
        assertEquals(email, registeredUser.getEmail());
        assertEquals(encodedPassword, registeredUser.getPassword());
        assertFalse(registeredUser.isEnabled());
        assertNotNull(registeredUser.getVerificationCode());
        assertEquals(100, registeredUser.getLoyaltyPoints());

        verify(userRepository, times(1)).save(any(User.class));
        verify(kafkaTemplate, times(1)).send(eq("auth-events"), eq(email), any(UserCreatedEvent.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        String name = "John Doe";
        String email = "john@example.com";
        String password = "password123";

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            authService.register(name, email, password)
        );

        assertEquals("Email address is already in use.", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void verifyEmail_Success() {
        String otp = "123456";
        User user = User.builder().id(1L).email("john@example.com").verificationCode(otp).enabled(false).build();

        when(userRepository.findByVerificationCode(otp)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        boolean verified = authService.verifyEmail(otp);

        assertTrue(verified);
        assertTrue(user.isEnabled());
        assertNull(user.getVerificationCode());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void verifyEmail_InvalidOtp_ReturnsFalse() {
        String otp = "000000";
        when(userRepository.findByVerificationCode(otp)).thenReturn(Optional.empty());

        boolean verified = authService.verifyEmail(otp);

        assertFalse(verified);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        String email = "john@example.com";
        String rawPassword = "password123";
        String encodedPassword = "encodedPassword123";
        User user = User.builder()
                .id(1L)
                .email(email)
                .password(encodedPassword)
                .enabled(true)
                .twoFactorEnabled(false)
                .build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);
        when(jwtService.generateAccessToken(eq(email), eq(1L), any(), eq(false))).thenReturn("access-token-123");
        when(refreshTokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var response = authService.login(email, rawPassword);

        assertNotNull(response);
        assertEquals(false, response.get("requires2fa"));
        assertEquals("access-token-123", response.get("accessToken"));
        assertNotNull(response.get("refreshToken"));
        assertEquals(user, response.get("user"));
    }

    @Test
    void login_IncorrectPassword_ThrowsException() {
        String email = "john@example.com";
        String rawPassword = "wrongPassword";
        String encodedPassword = "encodedPassword123";
        User user = User.builder().id(1L).email(email).password(encodedPassword).build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            authService.login(email, rawPassword)
        );

        assertEquals("Incorrect email or password credentials.", exception.getMessage());
    }

    @Test
    void login_UnverifiedUser_ThrowsException() {
        String email = "john@example.com";
        String password = "password123";
        User user = User.builder().id(1L).email(email).password("encoded").enabled(false).build();

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(password, "encoded")).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> 
            authService.login(email, password)
        );

        assertTrue(exception.getMessage().contains("User account is not verified."));
    }
}
