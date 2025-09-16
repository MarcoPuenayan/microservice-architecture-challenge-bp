package com.pichincha.account.transaction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.PostDepositAccountResponse;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.application.service.FindAllTransactionsServiceImpl;
import com.pichincha.account.transaction.domain.model.Transaction;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;

public class FindAllTransactionsServiceImplTest {
  @Mock
  private TransactionRepositoryPort transactionRepositoryPort;
  @Mock
  private DomainApiClient accountApi;

  @InjectMocks
  private FindAllTransactionsServiceImpl service;

  String accountNumber;
  String accountNumber2;
  String typeAccount;
  String typeAccount2;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    accountNumber = "A1";
    accountNumber2 = "A2";
    typeAccount = "Cuenta Corriente";
    typeAccount2 = "Cuenta Ahorros";
  }

  @Test
  void testFindAllTransactionsWithAccountDescriptions() {
    Transaction tx1 = new Transaction();
    tx1.setAccountNumber(accountNumber);
    Transaction tx2 = new Transaction();
    tx2.setAccountNumber(accountNumber2);
    List<Transaction> txList = List.of(tx1, tx2);
    Page<Transaction> txPage = new PageImpl<>(txList);

    when(transactionRepositoryPort.findAllTransactions(any())).thenReturn(txPage);

    PostDepositAccountResponse acc1 = new PostDepositAccountResponse();
    acc1.setAccountNumber(accountNumber);
    acc1.setAccountTypeDescription(typeAccount);
    PostDepositAccountResponse acc2 = new PostDepositAccountResponse();
    acc2.setAccountNumber(accountNumber2);
    acc2.setAccountTypeDescription(typeAccount2);
    List<PostDepositAccountResponse> accList = List.of(acc1, acc2);

    when(accountApi.postDepositAccountBatch(any())).thenReturn(ResponseEntity.ok(accList));

    Page<Transaction> result = service.findAllTransactions(PageRequest.of(0, 10));

    assertEquals(typeAccount, result.getContent().get(0).getAccountDescription());
    assertEquals(typeAccount2, result.getContent().get(1).getAccountDescription());
  }

  @Test
  void testFindAllTransactionsWithEmptyAccounts() {
    Transaction tx1 = new Transaction();
    tx1.setAccountNumber(accountNumber);
    Page<Transaction> txPage = new PageImpl<>(List.of(tx1));

    when(transactionRepositoryPort.findAllTransactions(any())).thenReturn(txPage);
    when(accountApi.postDepositAccountBatch(any())).thenReturn(ResponseEntity.ok(List.of()));

    Page<Transaction> result = service.findAllTransactions(PageRequest.of(0, 10));

    assertNull(result.getContent().get(0).getAccountDescription());
  }

  @Test
  void testFindAllTransactionsEmptyPage() {
    Page<Transaction> txPage = new PageImpl<>(List.of());
    when(transactionRepositoryPort.findAllTransactions(any())).thenReturn(txPage);

    Page<Transaction> result = service.findAllTransactions(PageRequest.of(0, 10));

    assertTrue(result.isEmpty());
    verify(accountApi, never()).postDepositAccountBatch(any());
  }
}
