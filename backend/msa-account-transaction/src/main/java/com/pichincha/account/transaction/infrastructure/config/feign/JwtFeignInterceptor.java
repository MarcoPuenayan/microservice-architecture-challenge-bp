package com.pichincha.account.transaction.infrastructure.config.feign;

import com.pichincha.account.transaction.infrastructure.output.service.AuthenticationService;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Interceptor de Feign que agrega automáticamente el token JWT Bearer a las solicitudes
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFeignInterceptor implements RequestInterceptor {
    
    private final AuthenticationService authenticationService;
    
    @Override
    public void apply(RequestTemplate template) {
        try {
            String bearerToken = authenticationService.getBearerToken();
            template.header("Authorization", bearerToken);
            log.debug("Token Bearer agregado a la solicitud: {}", template.url());
        } catch (Exception e) {
            log.error("Error al agregar token Bearer a la solicitud de Feign", e);
            throw new RuntimeException("Error al obtener token de autenticación", e);
        }
    }
}
