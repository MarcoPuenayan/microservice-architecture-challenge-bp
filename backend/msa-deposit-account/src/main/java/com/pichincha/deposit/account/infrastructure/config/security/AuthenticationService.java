package com.pichincha.deposit.account.infrastructure.config.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Servicio genérico para el manejo de autenticación JWT
 * Puede ser reutilizado en cualquier parte del proyecto que necesite autenticación
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final JwtTokenService jwtTokenService;

    /**
     * Obtiene un token JWT válido para ser usado en llamadas a APIs externas
     * @return Token JWT en formato Bearer
     */
    public String getAuthorizationHeader() {
        return jwtTokenService.getBearerToken();
    }

    /**
     * Obtiene solo el token JWT sin el prefijo Bearer
     * @return Token JWT
     */
    public String getAccessToken() {
        return jwtTokenService.getValidToken();
    }

    /**
     * Invalida el token actual para forzar la obtención de uno nuevo
     * Útil cuando se recibe un error 401 Unauthorized
     */
    public void refreshToken() {
        log.info("Refreshing authentication token");
        jwtTokenService.invalidateToken();
    }

    /**
     * Verifica si el servicio de autenticación está configurado correctamente
     * @return true si está configurado, false en caso contrario
     */
    public boolean isConfigured() {
        try {
            jwtTokenService.getValidToken();
            return true;
        } catch (Exception e) {
            log.warn("Authentication service is not properly configured", e);
            return false;
        }
    }
}
