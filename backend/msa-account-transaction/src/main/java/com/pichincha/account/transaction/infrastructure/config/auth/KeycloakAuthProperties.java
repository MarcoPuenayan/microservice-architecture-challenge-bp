package com.pichincha.account.transaction.infrastructure.config.auth;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * Configuración de propiedades para autenticación con Keycloak
 */
@Data
@Component
@ConfigurationProperties(prefix = "keycloak.auth")
public class KeycloakAuthProperties {
    
    /**
     * URL del endpoint de token de Keycloak
     */
    private String tokenUrl;
    
    /**
     * Grant type para la autenticación
     */
    private String grantType = "password";
    
    /**
     * Client ID para la autenticación
     */
    private String clientId;
    
    /**
     * Client Secret para la autenticación
     */
    private String clientSecret;
    
    /**
     * Username para la autenticación
     */
    private String username;
    
    /**
     * Password para la autenticación
     */
    private String password;
    
    /**
     * Tiempo en segundos antes de la expiración para renovar el token
     */
    private Integer refreshThresholdSeconds = 30;
}
