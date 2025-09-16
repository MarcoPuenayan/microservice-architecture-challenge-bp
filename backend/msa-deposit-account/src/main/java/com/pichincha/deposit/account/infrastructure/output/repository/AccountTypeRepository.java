package com.pichincha.deposit.account.infrastructure.output.repository;

import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountTypeRepository extends JpaRepository<AccountTypeEntity, Long> {

}
