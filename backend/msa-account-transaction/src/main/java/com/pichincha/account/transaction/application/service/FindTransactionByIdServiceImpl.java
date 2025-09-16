package com.pichincha.account.transaction.application.service;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.transaction.application.input.port.FindTransactionByIdUseCase;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.domain.utils.Constants;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindTransactionByIdServiceImpl implements FindTransactionByIdUseCase {

    private final TransactionRepositoryPort transactionRepositoryPort;
    private final DomainApiClient accountApi;

  @Override
  @Cacheable(
      value = "findTransactionById",
      key = "#transactionId"
  )
  public Transaction findTransactionById(String transactionId) {
    log.info("Fetching transaction with ID: {}", transactionId);
    Transaction transaction = transactionRepositoryPort.findTransactionById(transactionId);
    if (transaction == null) {
      log.warn("Transaction not found with ID: {}", transactionId);
      throw new GlobalErrorException(String.format(
          Constants.TRANSACTION_NOT_FOUND, transactionId),
          "findTransactionById", HttpStatus.NOT_FOUND);
    }

    GetDepositAccountByIdResponse account = accountApi.getDepositAccountById
        (transaction.getAccountNumber()).getBody();
    assert account != null;
    transaction.setAccountDescription(account.getAccountTypeDescription());

    log.info("Transaction with ID: {} retrieved successfully", transactionId);
    return transaction;
  }

}
