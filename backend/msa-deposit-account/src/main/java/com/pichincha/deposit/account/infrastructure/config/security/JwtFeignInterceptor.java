package com.pichincha.deposit.account.infrastructure.config.security;

import feign.RequestInterceptor;
import feign.RequestTemplate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtFeignInterceptor implements RequestInterceptor {

    private final JwtTokenService jwtTokenService;

    @Override
    public void apply(RequestTemplate template) {
        try {
            String bearerToken = jwtTokenService.getBearerToken();
            template.header("Authorization", bearerToken);
            log.debug("JWT token added to Feign request for URL: {}", template.url());
        } catch (Exception e) {
            log.error("Error adding JWT token to Feign request", e);
            throw e;
        }
    }
}
