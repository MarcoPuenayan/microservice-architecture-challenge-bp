package com.pichincha.customer.profiles.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.application.service.UpdateCustomerServiceImpl;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class UpdateCustomerServiceImplTest {

  @Mock
  private CustomerRepositoryPort customerRepositoryPort;

  private UpdateCustomerServiceImpl updateCustomerService;

  String customerId;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    updateCustomerService = new UpdateCustomerServiceImpl(customerRepositoryPort);

    customerId = "123";
  }

  @Test
  void shouldUpdateCustomerSuccessfully() {
    Customer existingCustomer = new Customer();
    existingCustomer.setCustomerId("ID123");
    existingCustomer.setPassword("password123");
    existingCustomer.setName("Old Name");
    existingCustomer.setGender("Male");
    existingCustomer.setAge(30);
    existingCustomer.setIdentification("1111111111");
    existingCustomer.setAddress("Old Address");
    existingCustomer.setPhone("123456789");
    existingCustomer.setStatus(true);

    Customer updateRequest = new Customer();
    updateRequest.setCustomerId("ID456");
    updateRequest.setPassword("newPassword");
    updateRequest.setName("New Name");
    updateRequest.setGender("Female");
    updateRequest.setAge(28);
    updateRequest.setIdentification("2222222222");
    updateRequest.setAddress("New Address");
    updateRequest.setPhone("987654321");
    updateRequest.setStatus(false);

    when(customerRepositoryPort.findCustomerById(customerId)).thenReturn(existingCustomer);

    updateCustomerService.updateCustomer(customerId, updateRequest);

    assertThat(existingCustomer.getName()).isEqualTo(updateRequest.getName());
    assertThat(existingCustomer.getGender()).isEqualTo(updateRequest.getGender());
    assertThat(existingCustomer.getAge()).isEqualTo(updateRequest.getAge());
    assertThat(existingCustomer.getIdentification()).isEqualTo(updateRequest.getIdentification());
    assertThat(existingCustomer.getAddress()).isEqualTo(updateRequest.getAddress());
    assertThat(existingCustomer.getPhone()).isEqualTo(updateRequest.getPhone());
    assertThat(existingCustomer.getPassword()).isEqualTo(updateRequest.getPassword());
    assertThat(existingCustomer.getStatus()).isEqualTo(updateRequest.getStatus());

    verify(customerRepositoryPort).findCustomerById(customerId);
    verify(customerRepositoryPort).updateCustomer(eq(customerId), any(Customer.class));
  }

  @Test
  void shouldThrowExceptionWhenCustomerNotFound() {
    Customer updateRequest = new Customer();

    when(customerRepositoryPort.findCustomerById(customerId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> {
      updateCustomerService.updateCustomer(customerId, updateRequest);
    });
  }

}
