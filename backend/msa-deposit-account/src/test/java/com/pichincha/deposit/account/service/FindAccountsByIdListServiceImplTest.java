package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.service.FindAccountsByIdListServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

public class FindAccountsByIdListServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;

  @InjectMocks
  private FindAccountsByIdListServiceImpl service;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testFindAllByAccountNumberInReturnsAccounts() {
    List<String> accountNumbers = Arrays.asList("123", "456");
    Account account1 = new Account();
    account1.setAccountNumber("123");
    Account account2 = new Account();
    account2.setAccountNumber("456");
    List<Account> accounts = Arrays.asList(account1, account2);

    when(accountRepositoryPort.findAllByAccountNumberIn(accountNumbers)).thenReturn(accounts);

    List<Account> result = service.findAllByAccountNumberIn(accountNumbers);

    assertEquals(2, result.size());
    assertEquals("123", result.get(0).getAccountNumber());
    assertEquals("456", result.get(1).getAccountNumber());
    verify(accountRepositoryPort).findAllByAccountNumberIn(accountNumbers);
  }

  @Test
  void testFindAllByAccountNumberInEmptyList() {
    List<String> accountNumbers = Collections.emptyList();
    when(accountRepositoryPort.findAllByAccountNumberIn(accountNumbers)).thenReturn(Collections.emptyList());

    List<Account> result = service.findAllByAccountNumberIn(accountNumbers);

    assertTrue(result.isEmpty());
    verify(accountRepositoryPort).findAllByAccountNumberIn(accountNumbers);
  }

}
