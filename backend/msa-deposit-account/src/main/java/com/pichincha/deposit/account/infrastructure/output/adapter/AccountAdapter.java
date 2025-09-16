package com.pichincha.deposit.account.infrastructure.output.adapter;

import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.output.repository.AccountRepository;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountEntity;
import com.pichincha.deposit.account.infrastructure.output.repository.mapper.AccountMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AccountAdapter implements AccountRepositoryPort {
  private final AccountRepository accountRepository;
  private final AccountMapper accountMapper;

  @Override
  public Account createAccount(Account account) {
    AccountEntity entity = accountMapper.toEntity(account);
    AccountEntity savedEntity = accountRepository.save(entity);
    return accountMapper.toDomain(savedEntity);
  }

  @Override
  public Account findAccountById(String accountNumber) {
    Optional<AccountEntity> entityOpt = accountRepository.findById(accountNumber);
    return entityOpt.map(accountMapper::toDomain).orElse(null);
  }

  @Override
  public Page<Account> findAllAccounts(Pageable pageable) {
    return accountRepository.findAll(pageable)
        .map(accountMapper::toDomain);
  }

  @Override
  public Account updateAccount(String accountNumber, Account account) {
    AccountEntity entity = accountMapper.toEntity(account);
    AccountEntity updatedEntity = accountRepository.save(entity);
    return accountMapper.toDomain(updatedEntity);
  }

  @Override
  public void deleteAccountById(String accountNumber) {
    accountRepository.deleteById(accountNumber);
  }

  @Override
  public Optional<Account> findByAccountNumberAndAccountType(String accountNumber, Long accountTypeId) {
    return accountRepository.findByAccountNumberAndAccountTypeId(accountNumber, accountTypeId)
        .map(accountMapper::toDomain);
  }

  public AccountEntity findByIdEntity(String accountNumber) {
    return accountRepository.findById(accountNumber).orElse(null);
  }

  @Override
  public List<Account> findByCustomerId(String customerId){
    List<AccountEntity> entities = accountRepository.findByCustomerId(customerId);
    return entities.stream()
        .map(accountMapper::toDomain)
        .toList();
  }

  @Override
  public List<Account> findAllByAccountNumberIn(List<String> accountNumbers) {
    List<AccountEntity> entities = accountRepository.findAllByAccountNumberIn(accountNumbers);
    return entities.stream()
        .map(accountMapper::toDomain)
        .toList();
  }
}
