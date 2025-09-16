package com.pichincha.deposit.account.application.input.port;

import com.pichincha.deposit.account.domain.model.Account;

public interface CreateAccountUseCase {
  Account createAccount(Account account);
}
