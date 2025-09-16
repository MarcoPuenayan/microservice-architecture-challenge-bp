package com.pichincha.deposit.account.infrastructure.output.repository;

import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<AccountEntity, String> {
  Optional<AccountEntity> findByAccountNumberAndAccountTypeId(String accountNumber, Long accountTypeId);

  List<AccountEntity> findByCustomerId(String customerId);

  List<AccountEntity> findAllByAccountNumberIn(List<String> accountNumbers);
}
