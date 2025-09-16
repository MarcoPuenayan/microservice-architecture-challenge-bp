package com.pichincha.deposit.account.application.input.port;

import com.pichincha.deposit.account.domain.model.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FindAllAccountsUseCase {
  Page<Account> findAllAccounts(Pageable pageable);
}
