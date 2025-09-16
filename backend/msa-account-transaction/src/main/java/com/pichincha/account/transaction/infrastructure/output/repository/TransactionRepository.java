package com.pichincha.account.transaction.infrastructure.output.repository;

import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<TransactionEntity, String> {
  List<TransactionEntity> findByAccountNumber(String accountNumber);
}
