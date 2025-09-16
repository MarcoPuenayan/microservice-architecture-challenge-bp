package com.pichincha.deposit.account.infrastructure.output.adapter;

import com.pichincha.deposit.account.application.output.port.AccountTypeRepositoryPort;
import com.pichincha.deposit.account.domain.model.AccountType;
import com.pichincha.deposit.account.domain.utils.Constants;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import com.pichincha.deposit.account.infrastructure.output.repository.AccountTypeRepository;
import com.pichincha.deposit.account.infrastructure.output.repository.mapper.AccountTypeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AccountTypeAdapter implements AccountTypeRepositoryPort{
  private final AccountTypeRepository accountTypeRepository;
  private final AccountTypeMapper accountTypeMapper;

  @Override
  public AccountType findAccountTypeById(Long id) {
    return accountTypeRepository.findById(id)
        .map(accountTypeMapper::toDomain)
        .orElseThrow(() ->
            new GlobalErrorException(String.format(
                String.format(Constants.ACCOUNT_TYPE_NOT_FOUND, id)),
                "findAccountTypeById", HttpStatus.NOT_FOUND)
        );
  }

}
