package com.pichincha.deposit.account.application.input.port;

import com.pichincha.deposit.account.domain.model.Account;

public interface UpdateAccountUseCase {
  Account updateAccount(String accountId, Account account);
}
