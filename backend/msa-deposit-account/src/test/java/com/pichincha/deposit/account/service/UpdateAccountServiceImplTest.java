package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.output.port.AccountTypeRepositoryPort;
import com.pichincha.deposit.account.application.service.UpdateAccountServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.domain.model.AccountType;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.UUID;

public class UpdateAccountServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;
  @Mock
  private AccountTypeRepositoryPort accountTypeRepositoryPort;
  @Mock
  private DomainApiClient customerApiClient;

  @InjectMocks
  private UpdateAccountServiceImpl service;

  private Account existingAccount;
  private Account updatedAccount;
  private String accountId;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    accountId = "123";
    existingAccount = new Account();
    existingAccount.setAccountNumber(accountId);
    existingAccount.setCustomerId(UUID.randomUUID().toString());
    existingAccount.setAccountTypeId(1L);
    existingAccount.setInitialBalance(100.0);
    existingAccount.setStatus(true);

    updatedAccount = new Account();
    updatedAccount.setCustomerId(UUID.randomUUID().toString());
    updatedAccount.setAccountTypeId(2L);
    updatedAccount.setInitialBalance(200.0);
    updatedAccount.setStatus(false);
  }

  @Test
  void testUpdateAccountSuccess() {
    GetCustomerProfilesByIdResponse response = new GetCustomerProfilesByIdResponse();
    when(customerApiClient.getCustomerProfilesById(any(UUID.class)))
        .thenReturn(ResponseEntity.ok(response));
    when(accountTypeRepositoryPort.findAccountTypeById(updatedAccount.getAccountTypeId()))
        .thenReturn(new AccountType(2L, "Corriente"));
    when(accountRepositoryPort.findAccountById(accountId)).thenReturn(existingAccount);
    when(accountRepositoryPort.updateAccount(eq(accountId), any(Account.class)))
        .thenAnswer(invocation -> invocation.getArgument(1));

    Account result = service.updateAccount(accountId, updatedAccount);

    assertNotNull(result);
    assertEquals(updatedAccount.getAccountTypeId(), result.getAccountTypeId());
    assertEquals(updatedAccount.getInitialBalance(), result.getInitialBalance());
    assertEquals(updatedAccount.getCustomerId(), result.getCustomerId());
    assertEquals(updatedAccount.getStatus(), result.getStatus());

    assertEquals(updatedAccount.getAccountTypeId(), existingAccount.getAccountTypeId());
    assertEquals(updatedAccount.getInitialBalance(), existingAccount.getInitialBalance());
    assertEquals(updatedAccount.getCustomerId(), existingAccount.getCustomerId());
    assertEquals(updatedAccount.getStatus(), existingAccount.getStatus());
  }

  @Test
  void testUpdateAccountAccountNotFound() {
    when(accountRepositoryPort.findAccountById(accountId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> service.updateAccount(accountId, updatedAccount));
  }

}
