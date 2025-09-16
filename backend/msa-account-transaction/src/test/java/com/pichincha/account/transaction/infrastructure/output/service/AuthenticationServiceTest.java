package com.pichincha.account.transaction.infrastructure.output.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private JwtTokenService jwtTokenService;

    @InjectMocks
    private AuthenticationService authenticationService;

    @BeforeEach
    void setUp() {
        when(jwtTokenService.getValidToken()).thenReturn("test-access-token");
    }

    @Test
    void testGetBearerToken_ShouldReturnTokenWithBearerPrefix() {
        // When
        String bearerToken = authenticationService.getBearerToken();

        // Then
        assertEquals("Bearer test-access-token", bearerToken);
        verify(jwtTokenService).getValidToken();
    }

    @Test
    void testGetAccessToken_ShouldReturnRawToken() {
        // When
        String accessToken = authenticationService.getAccessToken();

        // Then
        assertEquals("test-access-token", accessToken);
        verify(jwtTokenService).getValidToken();
    }

    @Test
    void testInvalidateCurrentToken_ShouldCallJwtTokenService() {
        // When
        authenticationService.invalidateCurrentToken();

        // Then
        verify(jwtTokenService).invalidateToken();
    }

    @Test
    void testIsConfigured_WhenTokenAvailable_ShouldReturnTrue() {
        // When
        boolean isConfigured = authenticationService.isConfigured();

        // Then
        assertTrue(isConfigured);
    }

    @Test
    void testIsConfigured_WhenTokenServiceThrowsException_ShouldReturnFalse() {
        // Given
        when(jwtTokenService.getValidToken()).thenThrow(new RuntimeException("Service unavailable"));

        // When
        boolean isConfigured = authenticationService.isConfigured();

        // Then
        assertFalse(isConfigured);
    }

    @Test
    void testIsConfigured_WhenTokenIsEmpty_ShouldReturnFalse() {
        // Given
        when(jwtTokenService.getValidToken()).thenReturn("");

        // When
        boolean isConfigured = authenticationService.isConfigured();

        // Then
        assertFalse(isConfigured);
    }
}
