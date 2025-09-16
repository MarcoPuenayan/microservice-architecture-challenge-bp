package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.service.FindAccountCustomerByIdServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

public class FindAccountCustomerByIdServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;
  @Mock
  private DomainApiClient customerApiClient;

  @InjectMocks
  private FindAccountCustomerByIdServiceImpl service;

  String customerId;
  String customerName;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    customerId = UUID.randomUUID().toString();
    customerName = "Cliente Test";
  }

  @Test
  void testGetAccountsByCustomerIdSuccess() {
    Account account1 = new Account();
    account1.setCustomerId(customerId);
    Account account2 = new Account();
    account2.setCustomerId(customerId);

    List<Account> accounts = Arrays.asList(account1, account2);

    GetCustomerProfilesByIdResponse response = new GetCustomerProfilesByIdResponse();
    response.setName(customerName);

    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(response));
    when(accountRepositoryPort.findByCustomerId(customerId)).thenReturn(accounts);

    List<Account> result = service.getAccountsByCustomerId(customerId);

    assertEquals(2, result.size());
    assertEquals(customerName, result.get(0).getCustomerName());
    assertEquals(customerName, result.get(1).getCustomerName());
  }

  @Test
  void testGetAccountsByCustomerIdCustomerResponseNull() {
    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(null));

    assertThrows(AssertionError.class, () -> service.getAccountsByCustomerId(customerId));
  }

}
