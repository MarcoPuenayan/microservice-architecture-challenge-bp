package com.pichincha.account.transaction.infrastructure.config.feign;

import com.pichincha.account.transaction.infrastructure.output.service.AuthenticationService;
import feign.RequestTemplate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collection;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JwtFeignInterceptorTest {

    @Mock
    private AuthenticationService authenticationService;

    @InjectMocks
    private JwtFeignInterceptor jwtFeignInterceptor;

    private RequestTemplate requestTemplate;

    @BeforeEach
    void setUp() {
        requestTemplate = new RequestTemplate();
        requestTemplate.target("http://example.com");
        when(authenticationService.getBearerToken()).thenReturn("Bearer test-token");
    }

    @Test
    void testApply_ShouldAddAuthorizationHeader() {
        // When
        jwtFeignInterceptor.apply(requestTemplate);

        // Then
        Map<String, Collection<String>> headers = requestTemplate.headers();
        assertTrue(headers.containsKey("Authorization"));
        
        Collection<String> authHeaders = headers.get("Authorization");
        assertNotNull(authHeaders);
        assertEquals(1, authHeaders.size());
        assertEquals("Bearer test-token", authHeaders.iterator().next());
        
        verify(authenticationService).getBearerToken();
    }

    @Test
    void testApply_WhenAuthServiceThrowsException_ShouldThrowRuntimeException() {
        // Given
        when(authenticationService.getBearerToken()).thenThrow(new RuntimeException("Auth service error"));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            jwtFeignInterceptor.apply(requestTemplate);
        });

        assertEquals("Error al obtener token de autenticación", exception.getMessage());
    }
}
