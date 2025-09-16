package com.pichincha.customer.profiles.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.application.service.FindCustomersByIdListServiceImpl;
import com.pichincha.customer.profiles.domain.model.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class FindCustomersByIdListServiceImplTest {

  @Mock
  private CustomerRepositoryPort customerRepositoryPort;

  private FindCustomersByIdListServiceImpl findCustomersByIdListService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    findCustomersByIdListService = new FindCustomersByIdListServiceImpl(customerRepositoryPort);
  }

  @Test
  void shouldReturnListOfCustomersByIds() {
    // Arrange
    List<String> ids = List.of("8f6c9b7e-7540-41d8-8118-a80e16725b3d",
        "8f6c9b7e-7540-41d8-8118-a80e16725b3d");

    Customer customer1 = new Customer();
    customer1.setCustomerId("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    customer1.setPassword("password123");
    customer1.setName("John Doe");

    Customer customer2 = new Customer();
    customer2.setCustomerId("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    customer2.setPassword("password123");
    customer2.setName("John Doe");

    List<Customer> mockCustomers = List.of(customer1, customer2);

    when(customerRepositoryPort.findAllByCustomerIdIn(ids)).thenReturn(mockCustomers);

    List<Customer> result = findCustomersByIdListService.findCustomersByIds(ids);

    assertThat(result).isNotNull();
    assertThat(result).hasSize(2);
    assertThat(result.get(0).getCustomerId()).isEqualTo("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    assertThat(result.get(1).getCustomerId()).isEqualTo("8f6c9b7e-7540-41d8-8118-a80e16725b3d");

    verify(customerRepositoryPort).findAllByCustomerIdIn(ids);
  }

  @Test
  void shouldReturnEmptyListWhenNoCustomersFound() {
    List<String> ids = List.of("999", "888");
    when(customerRepositoryPort.findAllByCustomerIdIn(ids)).thenReturn(List.of());

    List<Customer> result = findCustomersByIdListService.findCustomersByIds(ids);

    assertThat(result).isNotNull();
    assertThat(result).isEmpty();

    verify(customerRepositoryPort).findAllByCustomerIdIn(ids);
  }

}
