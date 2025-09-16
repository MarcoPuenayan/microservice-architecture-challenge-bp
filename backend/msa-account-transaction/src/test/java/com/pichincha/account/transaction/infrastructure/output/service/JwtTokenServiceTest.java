package com.pichincha.account.transaction.infrastructure.output.service;

import com.pichincha.account.transaction.infrastructure.config.auth.KeycloakAuthProperties;
import com.pichincha.account.transaction.infrastructure.output.model.TokenResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtTokenServiceTest {

    @Mock
    private KeycloakAuthProperties authProperties;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private JwtTokenService jwtTokenService;

    @BeforeEach
    void setUp() {
        when(authProperties.getTokenUrl()).thenReturn("http://localhost:9595/realms/bp-project/protocol/openid-connect/token");
        when(authProperties.getGrantType()).thenReturn("password");
        when(authProperties.getClientId()).thenReturn("bp-authentication");
        when(authProperties.getClientSecret()).thenReturn("secret");
        when(authProperties.getUsername()).thenReturn("dprado");
        when(authProperties.getPassword()).thenReturn("dprado");
        when(authProperties.getRefreshThresholdSeconds()).thenReturn(30);
        
        ReflectionTestUtils.setField(jwtTokenService, "restTemplate", restTemplate);
    }

    @Test
    void testGetValidToken_WhenNoTokenCached_ShouldObtainNewToken() {
        // Given
        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken("test-token");
        tokenResponse.setExpiresIn(3600);
        
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), any(), any(), eq(TokenResponse.class)))
            .thenReturn(responseEntity);

        // When
        String token = jwtTokenService.getValidToken();

        // Then
        assertEquals("test-token", token);
        verify(restTemplate).exchange(anyString(), any(), any(), eq(TokenResponse.class));
    }

    @Test
    void testGetValidToken_WhenTokenCachedAndValid_ShouldReturnCachedToken() {
        // Given
        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken("cached-token");
        tokenResponse.setExpiresIn(3600);
        
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), any(), any(), eq(TokenResponse.class)))
            .thenReturn(responseEntity);

        // First call to cache the token
        jwtTokenService.getValidToken();
        
        // When - Second call should use cached token
        String token = jwtTokenService.getValidToken();

        // Then
        assertEquals("cached-token", token);
        // Should only call REST template once (for initial token)
        verify(restTemplate, times(1)).exchange(anyString(), any(), any(), eq(TokenResponse.class));
    }

    @Test
    void testInvalidateToken_ShouldClearCache() {
        // Given
        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken("test-token");
        tokenResponse.setExpiresIn(3600);
        
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        
        when(restTemplate.exchange(anyString(), any(), any(), eq(TokenResponse.class)))
            .thenReturn(responseEntity);

        // Cache a token
        jwtTokenService.getValidToken();
        
        // When
        jwtTokenService.invalidateToken();
        
        // Then - Next call should obtain new token
        jwtTokenService.getValidToken();
        
        verify(restTemplate, times(2)).exchange(anyString(), any(), any(), eq(TokenResponse.class));
    }
}
