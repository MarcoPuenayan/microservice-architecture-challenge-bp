package com.pichincha.account.transaction.infrastructure.output.adapter;

import com.pichincha.account.transaction.application.output.port.TransactionTypeRepositoryPort;
import com.pichincha.account.transaction.domain.model.TransactionType;
import com.pichincha.account.transaction.domain.utils.Constants;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import com.pichincha.account.transaction.infrastructure.output.repository.TransactionTypeRepository;
import com.pichincha.account.transaction.infrastructure.output.repository.mapper.TransactionTypeMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TransactionTypeAdapter implements TransactionTypeRepositoryPort {

    private final TransactionTypeRepository transactionTypeRepository;
    private final TransactionTypeMapper transactionTypeMapper;

    @Override
    public TransactionType findTransactionTypeById(Long id) {
        return transactionTypeRepository.findById(id)
                .map(transactionTypeMapper::toDomain)
                .orElseThrow(() ->
                    new GlobalErrorException(String.format(
                        String.format(Constants.TRANSACTION_TYPE_NOT_FOUND, id)),
                        "findAccountTypeById", HttpStatus.NOT_FOUND)
                );
    }
}