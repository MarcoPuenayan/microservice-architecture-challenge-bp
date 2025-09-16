package com.pichincha.deposit.account.application.service;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.input.port.FindAccountByIdUseCase;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.domain.utils.Constants;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindAccountByIdServiceImpl implements FindAccountByIdUseCase {
  private final AccountRepositoryPort accountRepositoryPort;
  private final DomainApiClient customerApiClient;

  @Override
  public Account findAccountById(String accountNumber) {
    Account account = accountRepositoryPort.findAccountById(accountNumber);
    if (account == null) {
      log.warn("Account with number {} not found", accountNumber);
      throw new GlobalErrorException(String.format(
          String.format(Constants.ACCOUNT_NOT_FOUND, accountNumber)),
          "findAccountById", HttpStatus.NOT_FOUND);
    }

    GetCustomerProfilesByIdResponse getCustomerProfilesByIdResponse = customerApiClient.getCustomerProfilesById(
        UUID.fromString(account.getCustomerId())).getBody();
    assert getCustomerProfilesByIdResponse != null;
    account.setCustomerName(getCustomerProfilesByIdResponse.getName());

    log.info("Successfully fetched account with number: {}", accountNumber);
    return account;
  }
}
