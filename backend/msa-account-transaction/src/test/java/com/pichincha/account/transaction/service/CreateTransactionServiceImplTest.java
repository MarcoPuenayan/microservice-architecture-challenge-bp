package com.pichincha.account.transaction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.accounts.models.PutDepositAccountRequest;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.application.output.port.TransactionTypeRepositoryPort;
import com.pichincha.account.transaction.application.service.CreateTransactionServiceImpl;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.domain.model.TransactionType;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

public class CreateTransactionServiceImplTest {

  @Mock
  private TransactionRepositoryPort transactionRepositoryPort;
  @Mock
  private TransactionTypeRepositoryPort transactionTypeRepositoryPort;
  @Mock
  private DomainApiClient accountApi;

  @InjectMocks
  private CreateTransactionServiceImpl service;

  UUID customerId;
  Transaction transaction;
  GetDepositAccountByIdResponse account;
  TransactionType transactionType;
  String accountId;


  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    transactionType = new TransactionType(1L, "depósito");
    customerId = UUID.fromString("8f6c9b7e-7540-41d8-8118-a80e16725b3d");
    accountId = "123";

    transaction = new Transaction();
    transaction.setAccountNumber(accountId);
    transaction.setTransactionTypeId(1L);
    transaction.setTransactionValue(100.0);

    account = new GetDepositAccountByIdResponse();
    account.setInitialBalance(200.0);
    account.setAccountNumber(accountId);
    account.setAccountTypeId(1);
    account.setCustomerId(customerId);
    account.setStatus(true);
    account.setAccountTypeDescription("Cuenta de ahorros");
  }

  @Test
  void testCreateDepositTransactionSuccess() {
    when(accountApi.getDepositAccountById(accountId)).thenReturn(ResponseEntity.ok(account));
    when(transactionTypeRepositoryPort.findTransactionTypeById(1L)).thenReturn(transactionType);
    when(transactionRepositoryPort.createTransaction(any())).thenAnswer(i -> i.getArgument(0));

    Transaction result = service.createTransaction(transaction);

    assertTrue(result.getStatus());
    assertEquals(200.0, result.getBalance());
    verify(accountApi).putDepositAccount(eq(accountId), argThat(req ->
        req.getAccountNumber().equals(accountId) &&
            req.getAccountTypeId().equals(account.getAccountTypeId()) &&
            req.getStatus().equals(account.getStatus())
    ));
    verify(transactionRepositoryPort).createTransaction(any());
    assertEquals("Cuenta de ahorros", result.getAccountDescription());
  }

  @Test
  void testCreateWithdrawalTransactionSuccess() {
    transaction.setTransactionTypeId(2L);
    transaction.setTransactionValue(50.0);
    account.setInitialBalance(100.0);

    when(accountApi.getDepositAccountById(accountId)).thenReturn(ResponseEntity.ok(account));
    when(transactionTypeRepositoryPort.findTransactionTypeById(2L)).thenReturn(transactionType);
    when(transactionRepositoryPort.createTransaction(any())).thenAnswer(i -> i.getArgument(0));

    Transaction result = service.createTransaction(transaction);

    assertTrue(result.getStatus());
    assertEquals(100.0, result.getBalance());
    verify(accountApi).putDepositAccount(eq(accountId), argThat(req ->
        req.getAccountNumber().equals(accountId) &&
            req.getAccountTypeId().equals(account.getAccountTypeId()) &&
            req.getStatus().equals(account.getStatus())
    ));
    verify(transactionRepositoryPort).createTransaction(any());
    assertEquals("Cuenta de ahorros", result.getAccountDescription());
  }

  @Test
  void testCreateWithdrawalTransactionInsufficientBalance() {
    transaction.setTransactionTypeId(2L);
    transaction.setTransactionValue(150.0);
    account.setInitialBalance(100.0);

    when(accountApi.getDepositAccountById(accountId)).thenReturn(ResponseEntity.ok(account));
    when(transactionTypeRepositoryPort.findTransactionTypeById(2L)).thenReturn(transactionType);

    assertThrows(GlobalErrorException.class, () -> service.createTransaction(transaction));
  }

  @Test
  void testCreateWithdrawalTransactionExactBalance() {
    transaction.setTransactionTypeId(2L);
    transaction.setTransactionValue(100.0); // igual al saldo
    account.setInitialBalance(100.0);

    when(accountApi.getDepositAccountById(accountId)).thenReturn(ResponseEntity.ok(account));
    when(transactionTypeRepositoryPort.findTransactionTypeById(2L)).thenReturn(transactionType);
    when(transactionRepositoryPort.createTransaction(any())).thenAnswer(i -> i.getArgument(0));

    Transaction result = service.createTransaction(transaction);

    assertTrue(result.getStatus());
    assertEquals(100.0, result.getBalance());
    verify(accountApi).putDepositAccount(eq(accountId), argThat(req ->
        req.getAccountNumber().equals(accountId) &&
            req.getAccountTypeId().equals(account.getAccountTypeId()) &&
            req.getStatus().equals(account.getStatus()) &&
            req.getInitialBalance().equals(0.0) // saldo actualizado
    ));
  }

  @Test
  void testCreateDepositTransactionUpdatesBalance() {
    transaction.setTransactionTypeId(1L);
    transaction.setTransactionValue(50.0);
    account.setInitialBalance(100.0);

    when(accountApi.getDepositAccountById(accountId)).thenReturn(ResponseEntity.ok(account));
    when(transactionTypeRepositoryPort.findTransactionTypeById(1L)).thenReturn(transactionType);
    when(transactionRepositoryPort.createTransaction(any())).thenAnswer(i -> i.getArgument(0));

    Transaction result = service.createTransaction(transaction);

    assertTrue(result.getStatus());
    assertEquals(100.0, result.getBalance());
    verify(accountApi).putDepositAccount(eq(accountId), argThat(req ->
        req.getInitialBalance().equals(150.0) // saldo actualizado
    ));
  }
}
