package com.pichincha.account.transaction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.application.service.DeleteTransactionByIdServiceImpl;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

public class DeleteTransactionByIdServiceImplTest {

  @Mock
  private TransactionRepositoryPort transactionRepositoryPort;

  @InjectMocks
  private DeleteTransactionByIdServiceImpl service;

  String transactionId;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    transactionId = "tx123";
  }

  @Test
  void testDeleteTransactionByIdSuccess() {
    Transaction transaction = new Transaction();
    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(transaction);

    service.deleteTransactionById(transactionId);

    verify(transactionRepositoryPort).deleteTransactionById(transactionId);
  }

  @Test
  void testDeleteTransactionByIdNotFound() {
    when(transactionRepositoryPort.findTransactionById(transactionId)).thenReturn(null);

    assertThrows(GlobalErrorException.class, () -> service.deleteTransactionById(transactionId));
    verify(transactionRepositoryPort, never()).deleteTransactionById(anyString());
  }

}
