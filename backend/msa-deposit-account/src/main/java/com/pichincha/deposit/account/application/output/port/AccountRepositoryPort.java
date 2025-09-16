package com.pichincha.deposit.account.application.output.port;

import com.pichincha.deposit.account.domain.model.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AccountRepositoryPort {
  Account createAccount(Account account);
  Account findAccountById(String accountId);
  Page<Account> findAllAccounts(Pageable pageable);
  Account updateAccount(String accountId, Account account);
  void deleteAccountById(String accountId);
  Optional<Account> findByAccountNumberAndAccountType(String accountNumber, Long accountTypeId);
  List<Account> findByCustomerId(String customerId);
  List<Account> findAllByAccountNumberIn(List<String> accountNumbers);
}
