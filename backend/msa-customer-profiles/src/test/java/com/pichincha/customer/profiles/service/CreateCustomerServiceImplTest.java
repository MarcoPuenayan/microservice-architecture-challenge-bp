package com.pichincha.customer.profiles.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import com.pichincha.customer.profiles.application.service.CreateCustomerServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;

import java.util.Optional;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CreateCustomerServiceImplTest {

  private CustomerRepositoryPort customerRepositoryPort;
  private CreateCustomerServiceImpl createCustomerService;
  String identification;
  String customerId;

  @BeforeEach
  void setUp() {
    customerRepositoryPort = mock(CustomerRepositoryPort.class);
    createCustomerService = new CreateCustomerServiceImpl(customerRepositoryPort);

    identification = "0987654321";
    customerId = "8f6c9b7e-7540-41d8-8118-a80e16725b3d";
  }

  @Test
  void shouldThrowExceptionWhenCustomerAlreadyExists() {
    Customer customer = new Customer();
    customer.setIdentification(identification);

    when(customerRepositoryPort.findByIdentification(identification))
        .thenReturn(Optional.of(customer));

    assertThrows(GlobalErrorException.class, () -> {
      createCustomerService.createCustomer(customer);
    });
  }

  @Test
  void shouldCreateCustomerWhenNotExists() {
    Customer customer = new Customer();
    customer.setIdentification(identification);

    when(customerRepositoryPort.findByIdentification(identification))
        .thenReturn(Optional.empty());

    Customer createdCustomer = new Customer();
    createdCustomer.setCustomerId(customerId);
    createdCustomer.setIdentification(identification);
    createdCustomer.setStatus(true);

    when(customerRepositoryPort.createCustomer(any(Customer.class)))
        .thenReturn(createdCustomer);

    ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);

    Customer result = createCustomerService.createCustomer(customer);

    verify(customerRepositoryPort).createCustomer(captor.capture());
    assertTrue(captor.getValue().getStatus());

    assertNotNull(result);
    assertEquals(customerId, result.getCustomerId());
    assertTrue(result.getStatus());
    verify(customerRepositoryPort).createCustomer(customer);
  }

}
