package com.pichincha.account.transaction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.application.service.FindTransactionByIdServiceImpl;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

public class FindTransactionByIdServiceImplTest {

  @Mock
  private TransactionRepositoryPort transactionRepositoryPort;
  @Mock
  private DomainApiClient accountApi;

  @InjectMocks
  private FindTransactionByIdServiceImpl service;

  String accountNumber;
  String typeAccount;
  String transactionId;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);

    transactionId = "tx1";
    accountNumber = "ACC123";
    typeAccount = "Ahorros";
  }

  @Test
  void testFindTransactionByIdReturnsTransaction() {
    Transaction tx = new Transaction();
    tx.setAccountNumber(accountNumber);
    GetDepositAccountByIdResponse account = new GetDepositAccountByIdResponse();
    account.setAccountTypeDescription(typeAccount);

    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(tx);
    when(accountApi.getDepositAccountById(accountNumber)).thenReturn(ResponseEntity.ok(account));

    Transaction result = service.findTransactionById(transactionId);

    assertNotNull(result);
    assertEquals(typeAccount, result.getAccountDescription());
  }

  @Test
  void testFindTransactionByIdThrowsExceptionIfNotFound() {
    transactionId = "tx2";
    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> {
      service.findTransactionById(transactionId);
    });
  }

  @Test
  void testFindTransactionByIdSetsAccountDescription() {
    typeAccount = "Corriente";
    transactionId = "tx3";
    Transaction tx = new Transaction();
    tx.setAccountNumber(accountNumber);
    GetDepositAccountByIdResponse account = new GetDepositAccountByIdResponse();
    account.setAccountTypeDescription(typeAccount);

    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(tx);
    when(accountApi.getDepositAccountById(accountNumber)).thenReturn(ResponseEntity.ok(account));

    Transaction result = service.findTransactionById(transactionId);

    assertEquals(typeAccount, result.getAccountDescription());
  }

}
