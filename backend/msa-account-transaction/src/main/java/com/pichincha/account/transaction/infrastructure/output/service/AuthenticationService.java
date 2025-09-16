package com.pichincha.account.transaction.infrastructure.output.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio genérico de autenticación que puede ser reutilizado en otros componentes del proyecto
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {
    
    private final JwtTokenService jwtTokenService;
    
    /**
     * Obtiene un token Bearer válido para usar en headers de autorización
     *
     * @return Token en formato "Bearer {token}"
     */
    public String getBearerToken() {
        String token = jwtTokenService.getValidToken();
        return "Bearer " + token;
    }
    
    /**
     * Obtiene solo el token JWT sin el prefijo Bearer
     *
     * @return Token JWT
     */
    public String getAccessToken() {
        return jwtTokenService.getValidToken();
    }
    
    /**
     * Invalida el token actual, forzando la obtención de uno nuevo
     * Útil cuando se recibe un error 401 Unauthorized
     */
    public void invalidateCurrentToken() {
        log.info("Invalidando token actual debido a error de autenticación");
        jwtTokenService.invalidateToken();
    }
    
    /**
     * Verifica si el servicio de autenticación está configurado correctamente
     *
     * @return true si está configurado, false en caso contrario
     */
    public boolean isConfigured() {
        try {
            String token = getAccessToken();
            return token != null && !token.trim().isEmpty();
        } catch (Exception e) {
            log.warn("El servicio de autenticación no está configurado correctamente", e);
            return false;
        }
    }
}
