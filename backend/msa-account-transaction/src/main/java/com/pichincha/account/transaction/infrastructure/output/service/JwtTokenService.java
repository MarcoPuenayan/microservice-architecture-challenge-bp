package com.pichincha.account.transaction.infrastructure.output.service;

import com.pichincha.account.transaction.infrastructure.config.auth.KeycloakAuthProperties;
import com.pichincha.account.transaction.infrastructure.output.model.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Servicio para gestión de tokens JWT con cache y refresh automático
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class JwtTokenService {
    
    private final KeycloakAuthProperties authProperties;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ReentrantLock lock = new ReentrantLock();
    
    private String cachedToken;
    private LocalDateTime tokenExpirationTime;
    
    /**
     * Obtiene un token JWT válido. Si hay un token cacheado y no ha expirado, lo devuelve.
     * Si no, obtiene uno nuevo del servidor de autenticación.
     *
     * @return Token JWT válido
     */
    public String getValidToken() {
        lock.lock();
        try {
            if (isTokenValid()) {
                log.debug("Usando token cacheado válido");
                return cachedToken;
            }
            
            log.info("Obteniendo nuevo token JWT de Keycloak");
            return refreshToken();
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Invalida el token actual forzando la obtención de uno nuevo en la próxima solicitud
     */
    public void invalidateToken() {
        lock.lock();
        try {
            log.info("Invalidando token cacheado");
            cachedToken = null;
            tokenExpirationTime = null;
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Verifica si el token actual es válido y no está próximo a expirar
     */
    private boolean isTokenValid() {
        if (cachedToken == null || tokenExpirationTime == null) {
            return false;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thresholdTime = tokenExpirationTime.minus(
            authProperties.getRefreshThresholdSeconds(), ChronoUnit.SECONDS
        );
        
        boolean isValid = now.isBefore(thresholdTime);
        
        if (!isValid) {
            log.debug("Token expirado o próximo a expirar. Expira en: {}, umbral: {}", 
                tokenExpirationTime, thresholdTime);
        }
        
        return isValid;
    }
    
    /**
     * Obtiene un nuevo token del servidor de autenticación
     */
    private String refreshToken() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", authProperties.getGrantType());
            body.add("client_id", authProperties.getClientId());
            body.add("client_secret", authProperties.getClientSecret());
            body.add("username", authProperties.getUsername());
            body.add("password", authProperties.getPassword());
            
            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            
            ResponseEntity<TokenResponse> response = restTemplate.exchange(
                authProperties.getTokenUrl(),
                HttpMethod.POST,
                request,
                TokenResponse.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                TokenResponse tokenResponse = response.getBody();
                cachedToken = tokenResponse.getAccessToken();
                
                // Calculamos el tiempo de expiración
                tokenExpirationTime = LocalDateTime.now().plus(
                    tokenResponse.getExpiresIn(), ChronoUnit.SECONDS
                );
                
                log.info("Token JWT obtenido exitosamente. Expira en: {}", tokenExpirationTime);
                return cachedToken;
            } else {
                throw new RuntimeException("Error al obtener token JWT: " + response.getStatusCode());
            }
            
        } catch (Exception e) {
            log.error("Error al obtener token JWT de Keycloak", e);
            throw new RuntimeException("Error al obtener token JWT", e);
        }
    }
}
