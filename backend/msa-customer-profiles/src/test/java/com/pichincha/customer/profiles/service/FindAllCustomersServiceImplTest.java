package com.pichincha.customer.profiles.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.application.service.FindAllCustomersServiceImpl;
import com.pichincha.customer.profiles.domain.model.Customer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.*;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

public class FindAllCustomersServiceImplTest {

  @Mock
  private CustomerRepositoryPort customerRepositoryPort;

  private FindAllCustomersServiceImpl findAllCustomersService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    findAllCustomersService = new FindAllCustomersServiceImpl(customerRepositoryPort);
  }

  @Test
  void shouldReturnPagedCustomersSuccessfully() {
    Pageable pageable = PageRequest.of(0, 2);

    Customer customer1 = new Customer();
    customer1.setCustomerId("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    customer1.setPassword("password123");
    customer1.setName("John Doe");

    Customer customer2 = new Customer();
    customer2.setCustomerId("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    customer2.setPassword("password123");
    customer2.setName("John Doe");

    List<Customer> customers = (List.of(customer1, customer2));
    Page<Customer> expectedPage = new PageImpl<>(customers, pageable, customers.size());

    when(customerRepositoryPort.findAllCustomers(pageable)).thenReturn(expectedPage);

    Page<Customer> result = findAllCustomersService.findAllCustomers(pageable);

    assertThat(result).isNotNull();
    assertThat(result.getContent()).hasSize(2);
    assertThat(result.getContent().get(0).getName()).isEqualTo("John Doe");

    verify(customerRepositoryPort).findAllCustomers(pageable);
  }

  @Test
  void shouldReturnEmptyPageWhenNoCustomersFound() {
    Pageable pageable = PageRequest.of(0, 2);
    Page<Customer> emptyPage = new PageImpl<>(List.of(), pageable, 0);

    when(customerRepositoryPort.findAllCustomers(pageable)).thenReturn(emptyPage);

    Page<Customer> result = findAllCustomersService.findAllCustomers(pageable);

    assertThat(result).isNotNull();
    assertThat(result.getContent()).isEmpty();

    verify(customerRepositoryPort).findAllCustomers(pageable);
  }

}
