package com.pichincha.deposit.account.service;

import com.pichincha.deposit.account.infrastructure.config.security.JwtTokenService;
import com.pichincha.deposit.account.infrastructure.config.security.KeycloakAuthProperties;
import com.pichincha.deposit.account.infrastructure.config.security.TokenResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtTokenServiceTest {

    @Mock
    private KeycloakAuthProperties authProperties;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private JwtTokenService jwtTokenService;

    private TokenResponse tokenResponse;

    @BeforeEach
    void setUp() {
        tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken("test-access-token");
        tokenResponse.setTokenType("Bearer");
        tokenResponse.setExpiresIn(3600L);

        when(authProperties.getTokenUrl()).thenReturn("http://localhost:9595/realms/bp-project/protocol/openid-connect/token");
        when(authProperties.getGrantType()).thenReturn("password");
        when(authProperties.getClientId()).thenReturn("bp-authentication");
        when(authProperties.getClientSecret()).thenReturn("test-secret");
        when(authProperties.getUsername()).thenReturn("dprado");
        when(authProperties.getPassword()).thenReturn("dprado");
    }

    @Test
    void testGetValidToken_Success() {
        // Given
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(TokenResponse.class)))
                .thenReturn(responseEntity);

        // When
        String token = jwtTokenService.getValidToken();

        // Then
        assertNotNull(token);
        assertEquals("test-access-token", token);
        verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(TokenResponse.class));
    }

    @Test
    void testGetBearerToken_Success() {
        // Given
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(TokenResponse.class)))
                .thenReturn(responseEntity);

        // When
        String bearerToken = jwtTokenService.getBearerToken();

        // Then
        assertNotNull(bearerToken);
        assertEquals("Bearer test-access-token", bearerToken);
    }

    @Test
    void testGetValidToken_CachedToken() {
        // Given
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(TokenResponse.class)))
                .thenReturn(responseEntity);

        // When - Llamar dos veces
        String token1 = jwtTokenService.getValidToken();
        String token2 = jwtTokenService.getValidToken();

        // Then - Solo debe hacer una llamada HTTP
        assertEquals(token1, token2);
        verify(restTemplate, times(1)).postForEntity(anyString(), any(), eq(TokenResponse.class));
    }

    @Test
    void testInvalidateToken() {
        // Given
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(tokenResponse, HttpStatus.OK);
        when(restTemplate.postForEntity(anyString(), any(), eq(TokenResponse.class)))
                .thenReturn(responseEntity);

        // When
        String token1 = jwtTokenService.getValidToken();
        jwtTokenService.invalidateToken();
        String token2 = jwtTokenService.getValidToken();

        // Then - Debe hacer dos llamadas HTTP debido a la invalidación
        assertEquals(token1, token2);
        verify(restTemplate, times(2)).postForEntity(anyString(), any(), eq(TokenResponse.class));
    }

    @Test
    void testGetValidToken_HttpError() {
        // Given
        ResponseEntity<TokenResponse> responseEntity = new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
        when(restTemplate.postForEntity(anyString(), any(), eq(TokenResponse.class)))
                .thenReturn(responseEntity);

        // When & Then
        assertThrows(RuntimeException.class, () -> jwtTokenService.getValidToken());
    }
}
