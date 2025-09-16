package com.pichincha.account.transaction.application.service;

import com.pichincha.account.transaction.application.input.port.DeleteTransactionByIdUseCase;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.domain.utils.Constants;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class DeleteTransactionByIdServiceImpl implements DeleteTransactionByIdUseCase {

  private final TransactionRepositoryPort transactionRepositoryPort;

    @Override
    public void deleteTransactionById(String transactionId) {
      log.info("Deleting transaction with ID: {}", transactionId);
      Transaction existingTransaction = transactionRepositoryPort.findTransactionById(transactionId);
      if (existingTransaction == null) {
        log.warn("Transaction not found with ID: {}", transactionId);
        throw new GlobalErrorException(String.format(
            Constants.TRANSACTION_NOT_FOUND, transactionId),
            "deleteTransactionById", HttpStatus.NOT_FOUND);
      }

      transactionRepositoryPort.deleteTransactionById(transactionId);
      log.info("Transaction with ID: {} deleted successfully", transactionId);
    }
}
