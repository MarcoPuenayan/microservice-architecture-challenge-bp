package com.pichincha.account.transaction.infrastructure.config.feign;

import feign.RequestInterceptor;
import feign.codec.ErrorDecoder;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de componentes para Feign Client
 */
@Configuration
@RequiredArgsConstructor
public class FeignClientConfig {
    
    private final JwtFeignInterceptor jwtFeignInterceptor;
    private final JwtErrorDecoder jwtErrorDecoder;
    
    /**
     * Bean para el interceptor JWT que se aplicará a todos los clientes Feign
     */
    @Bean
    public RequestInterceptor requestInterceptor() {
        return jwtFeignInterceptor;
    }
    
    /**
     * Bean para el decoder de errores personalizado
     */
    @Bean
    public ErrorDecoder errorDecoder() {
        return jwtErrorDecoder;
    }
}
