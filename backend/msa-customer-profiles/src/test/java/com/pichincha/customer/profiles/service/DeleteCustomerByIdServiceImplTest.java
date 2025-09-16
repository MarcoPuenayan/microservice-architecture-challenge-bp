package com.pichincha.customer.profiles.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.application.service.DeleteCustomerByIdServiceImpl;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

public class DeleteCustomerByIdServiceImplTest {

  private CustomerRepositoryPort customerRepositoryPort;
  private DeleteCustomerByIdServiceImpl deleteCustomerByIdService;

  String customerId;

  @BeforeEach
  void setUp() {
    customerRepositoryPort = mock(CustomerRepositoryPort.class);
    deleteCustomerByIdService = new DeleteCustomerByIdServiceImpl(customerRepositoryPort);

    customerId = "8f6c9b7e-7540-41d8-8118-a80e16725b3d";
  }

  @Test
  void shouldDeleteCustomerWhenExists() {
    Customer customer = new Customer();

    when(customerRepositoryPort.findCustomerById(customerId)).thenReturn(customer);

    deleteCustomerByIdService.deleteCustomerById(customerId);

    verify(customerRepositoryPort).deleteCustomerById(customerId);
  }

  @Test
  void shouldThrowExceptionWhenCustomerNotFound() {
    when(customerRepositoryPort.findCustomerById(customerId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> {
      deleteCustomerByIdService.deleteCustomerById(customerId);
    });
  }

}
