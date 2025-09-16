package com.pichincha.account.transaction.application.service;

import com.pichincha.account.transaction.application.input.port.UpdateTransactionUseCase;
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
public class UpdateTransactionServiceImpl implements UpdateTransactionUseCase {
  private final TransactionRepositoryPort transactionRepositoryPort;

  @Override
  public Transaction updateTransaction(String transactionId, Transaction transaction) {
    log.info("Updating transaction with ID: {}", transactionId);

    Transaction existingTransaction = transactionRepositoryPort.findTransactionById(transactionId);
    if (existingTransaction == null) {
      log.warn("Transaction not found with ID: {}", transactionId);
      throw new GlobalErrorException(String.format(
          Constants.TRANSACTION_NOT_FOUND, transactionId),
          "findTransactionById", HttpStatus.NOT_FOUND);
    }

    existingTransaction.setTransactionDate(transaction.getTransactionDate());
    existingTransaction.setTransactionTypeId(transaction.getTransactionTypeId());
    existingTransaction.setTransactionValue(transaction.getTransactionValue());
    existingTransaction.setBalance(transaction.getBalance());
    existingTransaction.setStatus(transaction.getStatus());
    existingTransaction.setAccountNumber(transaction.getAccountNumber());

    Transaction updated = transactionRepositoryPort.updateTransaction(transactionId, existingTransaction);
    log.info("Transaction with ID: {} updated successfully", transactionId);
    return updated;
  }
}
