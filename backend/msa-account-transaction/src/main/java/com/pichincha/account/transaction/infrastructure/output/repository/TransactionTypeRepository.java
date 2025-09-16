package com.pichincha.account.transaction.infrastructure.output.repository;

import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionTypeRepository extends JpaRepository<TransactionTypeEntity, Long> {
}