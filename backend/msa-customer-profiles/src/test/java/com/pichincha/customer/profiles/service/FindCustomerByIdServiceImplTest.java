package com.pichincha.customer.profiles.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.application.service.FindCustomerByIdServiceImpl;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class FindCustomerByIdServiceImplTest {

  @Mock
  private CustomerRepositoryPort customerRepositoryPort;

  private FindCustomerByIdServiceImpl findCustomerByIdService;

  String customerId;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    findCustomerByIdService = new FindCustomerByIdServiceImpl(customerRepositoryPort);
    customerId = "8f6c9b7e-7540-41d8-8118-a80e16725b3d";
  }

  @Test
  void shouldReturnCustomerWhenIdExists() {
    Customer expectedCustomer = new Customer();
    expectedCustomer.setCustomerId("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    expectedCustomer.setPassword("password123");
    expectedCustomer.setName("John Doe");

    when(customerRepositoryPort.findCustomerById(customerId)).thenReturn(expectedCustomer);

    Customer result = findCustomerByIdService.findCustomerById(customerId);

    assertThat(result).isNotNull();
    assertThat(result.getCustomerId()).isEqualTo(customerId);
    assertThat(result.getName()).isEqualTo("John Doe");

    verify(customerRepositoryPort).findCustomerById(customerId);
  }

  @Test
  void shouldThrowExceptionWhenCustomerNotFound() {
    when(customerRepositoryPort.findCustomerById(customerId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> {
      findCustomerByIdService.findCustomerById(customerId);
    });
  }

}
