package com.pichincha.account.transaction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.application.service.UpdateTransactionServiceImpl;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class UpdateTransactionServiceImplTest {

  @Mock
  private TransactionRepositoryPort transactionRepositoryPort;

  @InjectMocks
  private UpdateTransactionServiceImpl service;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
  }

  @Test
  void testUpdateTransactionSuccess() {
    String transactionId = "tx1";
    Transaction existing = new Transaction();
    existing.setAccountNumber("ACC123");
    Transaction update = new Transaction();
    update.setAccountNumber("ACC456");
    update.setTransactionDate("2024-06-10T10:00:00");
    update.setTransactionTypeId(2L);
    update.setTransactionValue(100.0);
    update.setBalance(500.0);
    update.setStatus(true);

    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(existing);
    when(transactionRepositoryPort.updateTransaction(eq(transactionId), any(Transaction.class))).thenReturn(update);

    Transaction result = service.updateTransaction(transactionId, update);

    assertNotNull(result);
    assertEquals("ACC456", result.getAccountNumber());
    assertEquals(100.0, result.getTransactionValue());
    assertEquals(500.0, result.getBalance());
    assertEquals(true, result.getStatus());
  }

  @Test
  void testUpdateTransactionThrowsExceptionIfNotFound() {
    String transactionId = "tx2";
    Transaction update = new Transaction();

    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> {
      service.updateTransaction(transactionId, update);
    });
  }

  @Test
  void testUpdateTransactionFieldsAreUpdated() {
    String transactionId = "tx3";
    Transaction existing = new Transaction();
    existing.setAccountNumber("OLD_ACC");
    existing.setTransactionDate("2024-01-01T10:00:00");
    existing.setTransactionTypeId(1L);
    existing.setTransactionValue(10.0);
    existing.setBalance(100.0);
    existing.setStatus(false);

    Transaction update = new Transaction();
    update.setAccountNumber("NEW_ACC");
    update.setTransactionDate("2024-06-10T10:00:00");
    update.setTransactionTypeId(2L);
    update.setTransactionValue(200.0);
    update.setBalance(500.0);
    update.setStatus(true);

    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(existing);
    when(transactionRepositoryPort.updateTransaction(eq(transactionId), any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(1));

    Transaction result = service.updateTransaction(transactionId, update);

    assertEquals("NEW_ACC", result.getAccountNumber());
    assertEquals("2024-06-10T10:00:00", result.getTransactionDate());
    assertEquals(2L, result.getTransactionTypeId());
    assertEquals(200.0, result.getTransactionValue());
    assertEquals(500.0, result.getBalance());
    assertTrue(result.getStatus());
  }

}
