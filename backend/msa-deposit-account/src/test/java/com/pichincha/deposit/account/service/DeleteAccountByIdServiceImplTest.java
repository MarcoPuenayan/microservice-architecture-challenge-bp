package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.service.DeleteAccountByIdServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class DeleteAccountByIdServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;

  @InjectMocks
  private DeleteAccountByIdServiceImpl service;

  String accountId;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    accountId = "123";
  }

  @Test
  void testDeleteAccountByIdSuccess() {
    Account account = new Account();
    when(accountRepositoryPort.findAccountById(accountId)).thenReturn(account);

    assertDoesNotThrow(() -> service.deleteAccountById(accountId));
    verify(accountRepositoryPort).deleteAccountById(accountId);
  }

  @Test
  void testDeleteAccountByIdAccountNotFound() {
    when(accountRepositoryPort.findAccountById(accountId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> service.deleteAccountById(accountId));
    verify(accountRepositoryPort, never()).deleteAccountById(anyString());
  }

}
