package com.pichincha.account.transaction.application.output.port;

import com.pichincha.account.transaction.domain.model.Transaction;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TransactionRepositoryPort {
  Transaction createTransaction(Transaction transaction);
  Transaction findTransactionById(String transactionId);
  Page<Transaction> findAllTransactions(Pageable pageable);
  Transaction updateTransaction(String transactionId, Transaction transaction);
  void deleteTransactionById(String transactionId);
  List<Transaction> findByAccountNumber(String accountNumber);
}
