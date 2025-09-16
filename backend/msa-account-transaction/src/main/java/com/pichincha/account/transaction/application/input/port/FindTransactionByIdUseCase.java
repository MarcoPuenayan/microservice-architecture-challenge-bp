package com.pichincha.account.transaction.application.input.port;

import com.pichincha.account.transaction.domain.model.Transaction;

public interface FindTransactionByIdUseCase {
  Transaction findTransactionById(String transactionId);
}
