package com.pichincha.deposit.account.infrastructure.config.security;

import feign.Response;
import feign.codec.ErrorDecoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtErrorDecoder implements ErrorDecoder {

    private final JwtTokenService jwtTokenService;
    private final ErrorDecoder defaultErrorDecoder = new Default();

    @Override
    public Exception decode(String methodKey, Response response) {
        if (response.status() == 401) {
            log.warn("Received 401 Unauthorized, invalidating token for method: {}", methodKey);
            jwtTokenService.invalidateToken();
            return new RuntimeException("Authentication failed - token may have expired");
        }
        
        return defaultErrorDecoder.decode(methodKey, response);
    }
}
