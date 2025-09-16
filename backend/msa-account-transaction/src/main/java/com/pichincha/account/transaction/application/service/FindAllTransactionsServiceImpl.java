package com.pichincha.account.transaction.application.service;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.PostDepositAccountResponse;
import com.pichincha.account.transaction.application.input.port.FindAllTransactionsUseCase;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.domain.model.Transaction;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindAllTransactionsServiceImpl implements FindAllTransactionsUseCase {
  private final TransactionRepositoryPort transactionRepositoryPort;
  private final DomainApiClient accountApi;

  @Override
  public Page<Transaction> findAllTransactions(Pageable pageable) {
    Page<Transaction> transactionsPage = transactionRepositoryPort.findAllTransactions(pageable);

    if(!(transactionsPage.isEmpty())){
      List<String> accountIds = transactionsPage.getContent().stream()
          .map(Transaction::getAccountNumber)
          .toList();

      List<PostDepositAccountResponse> accountResponses =
          accountApi.postDepositAccountBatch(accountIds).getBody();

      assert accountResponses != null;
      if(!accountResponses.isEmpty()){
        Map<String, String> accountMap = accountResponses.stream()
            .collect(Collectors.toMap(
                PostDepositAccountResponse::getAccountNumber,
                PostDepositAccountResponse::getAccountTypeDescription
            ));

        transactionsPage.getContent().forEach(transaction -> {
          String accountTypeDescription = accountMap.get(transaction.getAccountNumber());
          transaction.setAccountDescription(accountTypeDescription);
        });
      }
    }

    return transactionsPage;
  }
}
