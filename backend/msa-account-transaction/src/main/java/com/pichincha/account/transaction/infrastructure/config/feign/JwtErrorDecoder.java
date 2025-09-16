package com.pichincha.account.transaction.infrastructure.config.feign;

import com.pichincha.account.transaction.infrastructure.output.service.AuthenticationService;
import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Decoder de errores personalizado que maneja errores 401 invalidando el token actual
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtErrorDecoder implements ErrorDecoder {
    
    private final AuthenticationService authenticationService;
    private final ErrorDecoder defaultDecoder = new Default();
    
    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == 401) {
            log.warn("Error 401 detectado en {}, invalidando token JWT", methodKey);
            authenticationService.invalidateCurrentToken();
        }
        
        return defaultDecoder.decode(methodKey, response);
    }
}
