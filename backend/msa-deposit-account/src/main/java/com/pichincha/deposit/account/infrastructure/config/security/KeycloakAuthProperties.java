package com.pichincha.deposit.account.infrastructure.config.security;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "auth.keycloak")
public class KeycloakAuthProperties {
    private String tokenUrl = "http://localhost:9595/realms/bp-project/protocol/openid-connect/token";
    private String grantType = "password";
    private String clientId = "bp-authentication";
    private String clientSecret = "PQhR0aW2g4WPVmE4frs3BwmGwtSgh5KI";
    private String username = "dprado";
    private String password = "dprado";
}
