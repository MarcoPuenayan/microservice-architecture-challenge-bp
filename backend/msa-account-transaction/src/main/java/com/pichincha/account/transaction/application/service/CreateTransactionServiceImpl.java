package com.pichincha.account.transaction.application.service;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.accounts.models.PutDepositAccountRequest;
import com.pichincha.account.transaction.application.input.port.CreateTransactionUseCase;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.application.output.port.TransactionTypeRepositoryPort;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.domain.utils.Constants;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@RequiredArgsConstructor
@Service
public class CreateTransactionServiceImpl implements CreateTransactionUseCase {
  private final TransactionRepositoryPort transactionRepositoryPort;
  private final TransactionTypeRepositoryPort transactionTypeRepositoryPort;
  private final DomainApiClient accountApi;

  @Override
  @Transactional
  public Transaction createTransaction(Transaction transaction) {
    log.info("Start creating transaction. AccountNumber={}, TransactionTypeId={}, Value={}",
        transaction.getAccountNumber(), transaction.getTransactionTypeId(), transaction.getTransactionValue());

    GetDepositAccountByIdResponse account = accountApi.getDepositAccountById
        (transaction.getAccountNumber()).getBody();

    var typeExists = transactionTypeRepositoryPort.findTransactionTypeById(transaction.getTransactionTypeId());

    assert account != null;
    double initialBalance = account.getInitialBalance();
    double updatedBalance;

    if (isWithdrawal(transaction)) {
      if (initialBalance < transaction.getTransactionValue()) {
        log.warn("Insufficient balance for withdrawal. CurrentBalance={}, WithdrawalAmount={}",
            initialBalance, transaction.getTransactionValue());
        throw new GlobalErrorException(Constants.INSUFFICIENT_BALANCE,
            "createTransaction", HttpStatus.CONFLICT);
      }
      updatedBalance = initialBalance - transaction.getTransactionValue();
      log.info("Processed withdrawal. New balance: {}", updatedBalance);
    } else {
      updatedBalance = initialBalance + transaction.getTransactionValue();
      log.info("Processed deposit. New balance: {}", updatedBalance);
    }

    account.setInitialBalance(updatedBalance);

    transaction.setBalance(initialBalance);
    transaction.setStatus(true);

    //Actualizo en account el saldo
    PutDepositAccountRequest accountUpd = new PutDepositAccountRequest();
    accountUpd.setAccountNumber(account.getAccountNumber());
    accountUpd.setAccountTypeId(account.getAccountTypeId());
    accountUpd.initialBalance(account.getInitialBalance());
    accountUpd.customerId(account.getCustomerId());
    accountUpd.setStatus(account.getStatus());

    accountApi.putDepositAccount(account.getAccountNumber(), accountUpd);
    //

    Transaction savedTransaction = transactionRepositoryPort.createTransaction(transaction);
    savedTransaction.setAccountDescription(account.getAccountTypeDescription());
    log.info("Transaction created successfully. TransactionId={}", savedTransaction.getTransactionId());
    return savedTransaction;
  }

  private boolean isWithdrawal(Transaction transaction) {
    return transaction.getTransactionTypeId() == 2;
  }

}
