package com.pichincha.deposit.account.application.service;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.domain.model.Account;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindAccountCustomerByIdServiceImpl {

  private final AccountRepositoryPort accountRepositoryPort;
  private final DomainApiClient customerApiClient;

  @Cacheable("getAccountsByCustomerId")
  public List<Account> getAccountsByCustomerId(String customerId) {
    log.info("Fetching getAccountsByCustomerId from DB...");
    GetCustomerProfilesByIdResponse getCustomerProfilesByIdResponse = customerApiClient.getCustomerProfilesById(
        UUID.fromString(customerId)).getBody();
    assert getCustomerProfilesByIdResponse != null;

    return accountRepositoryPort.findByCustomerId(customerId).stream()
        .peek(account -> {
          account.setCustomerName(getCustomerProfilesByIdResponse.getName());
        }).collect(Collectors.toList());
  }

}
