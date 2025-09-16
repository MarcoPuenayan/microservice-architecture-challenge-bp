package com.pichincha.account.transaction.application.input.port;

import com.pichincha.account.transaction.domain.model.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FindAllTransactionsUseCase {
  Page<Transaction> findAllTransactions(Pageable pageable);
}
