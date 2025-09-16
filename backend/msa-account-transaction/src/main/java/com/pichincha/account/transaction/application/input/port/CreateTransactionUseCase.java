package com.pichincha.account.transaction.application.input.port;

import com.pichincha.account.transaction.domain.model.Transaction;

public interface CreateTransactionUseCase {
  Transaction createTransaction(Transaction transaction);
}
