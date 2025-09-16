package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.output.port.AccountTypeRepositoryPort;
import com.pichincha.deposit.account.application.service.CreateAccountServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.domain.model.AccountType;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

public class CreateAccountServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;
  @Mock
  private AccountTypeRepositoryPort accountTypeRepositoryPort;
  @Mock
  private DomainApiClient customerApiClient;

  @InjectMocks
  private CreateAccountServiceImpl service;

  Account account;
  AccountType accountType;
  String nameCustomer;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);

    account = new Account();
    account.setAccountNumber("123");
    account.setCustomerId(UUID.randomUUID().toString());
    account.setAccountTypeId(1L);

    accountType = new AccountType(1L, "Ahorro");
    nameCustomer = "Cliente Test";
  }

  @Test
  void testCreateAccountSuccess() {
    GetCustomerProfilesByIdResponse response = new GetCustomerProfilesByIdResponse();
    response.setName(nameCustomer);

    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(response));
    when(accountTypeRepositoryPort.findAccountTypeById(anyLong()))
        .thenReturn(accountType);
    when(accountRepositoryPort.findByAccountNumberAndAccountType(anyString(),
        anyLong()))
        .thenReturn(Optional.empty());
    when(accountRepositoryPort.createAccount(any(Account.class)))
        .thenReturn(account);

    Account result = service.createAccount(account);

    assertNotNull(result);
    assertEquals(nameCustomer, result.getCustomerName());
    assertTrue(result.getStatus());
  }

  @Test
  void testCreateAccountAccountAlreadyExists() {
    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(new GetCustomerProfilesByIdResponse()));
    when(accountTypeRepositoryPort.findAccountTypeById(anyLong()))
        .thenReturn(accountType);
    when(accountRepositoryPort.findByAccountNumberAndAccountType(anyString(),
        anyLong()))
        .thenReturn(Optional.of(new Account()));

    assertThrows(GlobalErrorException.class, () -> {
      service.createAccount(account);
    });
  }

  @Test
  void testCreateAccountCustomerResponseNull() {
    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(null));
    when(accountTypeRepositoryPort.findAccountTypeById(anyLong()))
        .thenReturn(accountType);
    when(accountRepositoryPort.findByAccountNumberAndAccountType(anyString(),
        anyLong()))
        .thenReturn(Optional.empty());
    when(accountRepositoryPort.createAccount(any(Account.class)))
        .thenReturn(account);

    assertThrows(AssertionError.class, () -> {
      service.createAccount(account);
    });
  }

}
