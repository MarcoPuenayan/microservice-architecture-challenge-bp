package com.pichincha.account.transaction.application.input.port;

import com.pichincha.account.transaction.domain.model.Transaction;

public interface UpdateTransactionUseCase {
  Transaction updateTransaction(String transactionId, Transaction transaction);
}
