package com.pichincha.deposit.account.application.output.port;

import com.pichincha.deposit.account.domain.model.AccountType;

public interface AccountTypeRepositoryPort {
  AccountType findAccountTypeById(Long id);
}
