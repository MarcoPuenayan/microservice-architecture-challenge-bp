package com.pichincha.deposit.account.infrastructure.config.security;

import feign.RequestInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class FeignClientConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public RequestInterceptor jwtRequestInterceptor(JwtTokenService jwtTokenService) {
        return new JwtFeignInterceptor(jwtTokenService);
    }
}
