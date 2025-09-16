package com.pichincha.account.transaction.application.output.port;

import com.pichincha.account.transaction.domain.model.TransactionType;

public interface TransactionTypeRepositoryPort {
    TransactionType findTransactionTypeById(Long id);
}