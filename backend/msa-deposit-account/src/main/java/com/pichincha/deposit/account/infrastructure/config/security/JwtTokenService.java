package com.pichincha.deposit.account.infrastructure.config.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenService {

    private final KeycloakAuthProperties authProperties;
    private final RestTemplate restTemplate;
    private TokenResponse cachedToken;
    private LocalDateTime tokenExpiryTime;

    /**
     * Obtiene un token JWT válido, usando cache cuando es posible
     * @return Token JWT válido
     */
    public String getValidToken() {
        if (isTokenValid()) {
            log.debug("Using cached token");
            return cachedToken.getAccessToken();
        }
        
        log.info("Requesting new token from Keycloak");
        return requestNewToken();
    }

    /**
     * Verifica si el token actual es válido (existe y no ha expirado)
     */
    private boolean isTokenValid() {
        return cachedToken != null 
            && tokenExpiryTime != null 
            && LocalDateTime.now().isBefore(tokenExpiryTime.minus(30, ChronoUnit.SECONDS)); // 30 segundos de margen
    }

    /**
     * Solicita un nuevo token al servidor de autenticación
     */
    private String requestNewToken() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
            requestBody.add("grant_type", authProperties.getGrantType());
            requestBody.add("client_id", authProperties.getClientId());
            requestBody.add("client_secret", authProperties.getClientSecret());
            requestBody.add("username", authProperties.getUsername());
            requestBody.add("password", authProperties.getPassword());

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<TokenResponse> response = restTemplate.postForEntity(
                authProperties.getTokenUrl(), 
                request, 
                TokenResponse.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                cachedToken = response.getBody();
                tokenExpiryTime = LocalDateTime.now().plus(cachedToken.getExpiresIn() - 60, ChronoUnit.SECONDS); // 1 minuto de margen
                log.info("Token obtained successfully, expires at: {}", tokenExpiryTime);
                return cachedToken.getAccessToken();
            } else {
                throw new RuntimeException("Failed to obtain token: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error obtaining JWT token", e);
            throw new RuntimeException("Failed to obtain JWT token", e);
        }
    }

    /**
     * Invalida el token cached para forzar la obtención de uno nuevo
     */
    public void invalidateToken() {
        log.info("Invalidating cached token");
        cachedToken = null;
        tokenExpiryTime = null;
    }

    /**
     * Obtiene el token con formato Bearer
     */
    public String getBearerToken() {
        return "Bearer " + getValidToken();
    }
}
