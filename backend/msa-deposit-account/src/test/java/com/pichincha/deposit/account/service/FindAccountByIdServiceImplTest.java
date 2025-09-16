package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.service.FindAccountByIdServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public class FindAccountByIdServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;
  @Mock
  private DomainApiClient customerApiClient;

  @InjectMocks
  private FindAccountByIdServiceImpl service;

  Account account;
  String accountNumber;
  String customerName;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);

    account = new Account();
    account.setAccountNumber(accountNumber);
    account.setCustomerId(UUID.randomUUID().toString());

    accountNumber = "123";
    customerName = "Cliente Test";
  }

  @Test
  void testFindAccountByIdSuccess() {
    GetCustomerProfilesByIdResponse response = new GetCustomerProfilesByIdResponse();
    response.setName(customerName);

    when(accountRepositoryPort.findAccountById(accountNumber)).thenReturn(account);
    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(response));

    Account result = service.findAccountById(accountNumber);

    assertNotNull(result);
    assertEquals(customerName, result.getCustomerName());
  }

  @Test
  void testFindAccountByIdAccountNotFound() {
    when(accountRepositoryPort.findAccountById(accountNumber)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> service.findAccountById(accountNumber));
  }

  @Test
  void testFindAccountByIdCustomerResponseNull() {
    when(accountRepositoryPort.findAccountById(accountNumber)).thenReturn(account);
    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(null));

    assertThrows(AssertionError.class, () -> service.findAccountById(accountNumber));
  }

}
