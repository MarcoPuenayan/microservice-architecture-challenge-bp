package com.pichincha.deposit.account.application.service;

import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.domain.model.Account;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindAccountsByIdListServiceImpl {

  private final AccountRepositoryPort accountRepositoryPort;

  @Cacheable("findAllByAccountNumberIn")
  public List<Account> findAllByAccountNumberIn(List<String> accountNumbers) {
    log.info("Fetching findAllByAccountNumberIn from DB...");
    return accountRepositoryPort.findAllByAccountNumberIn(accountNumbers);
  }

}
