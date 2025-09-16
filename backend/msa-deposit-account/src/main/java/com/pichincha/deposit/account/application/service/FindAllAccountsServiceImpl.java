package com.pichincha.deposit.account.application.service;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.PostCustomerProfilesResponse;
import com.pichincha.deposit.account.application.input.port.FindAllAccountsUseCase;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.domain.model.Account;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindAllAccountsServiceImpl implements FindAllAccountsUseCase {
  private final AccountRepositoryPort accountRepositoryPort;
  private final DomainApiClient customerApiClient;

  @Override
  public Page<Account> findAllAccounts(Pageable pageable) {
    log.info("Fetching findAllAccounts from DB...");
    Page<Account> accountsPage = accountRepositoryPort.findAllAccounts(pageable);
    if(!(accountsPage.isEmpty())){
      List<String> customerIds = accountsPage.getContent().stream()
          .map(Account::getCustomerId)
          .toList();

      List<PostCustomerProfilesResponse> customerResponses =
          customerApiClient.postCustomerProfilesBatch(customerIds).getBody();

      assert customerResponses != null;
      if(!customerResponses.isEmpty()){
        Map<String, String> customerMap = customerResponses.stream()
            .collect(Collectors.toMap(
                PostCustomerProfilesResponse::getCustomerId,
                PostCustomerProfilesResponse::getName
            ));

        accountsPage.getContent().forEach(account -> {
          String customerName = customerMap.get(account.getCustomerId());
          account.setCustomerName(customerName);
        });
      }
    }
    return accountsPage;
  }

}
