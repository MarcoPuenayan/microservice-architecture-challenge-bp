package com.pichincha.account.transaction.infrastructure.output.adapter;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.domain.utils.Constants;
import com.pichincha.account.transaction.infrastructure.exception.GlobalErrorException;
import com.pichincha.account.transaction.infrastructure.output.repository.TransactionRepository;
import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionEntity;
import com.pichincha.account.transaction.infrastructure.output.repository.mapper.TransactionMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class TransactionAdapter implements TransactionRepositoryPort {

    private final TransactionRepository transactionRepository;
    private final TransactionMapper transactionMapper;
    private final DomainApiClient accountApi;


    @Override
    public Transaction createTransaction(Transaction transaction) {
        TransactionEntity entity = transactionMapper.toEntity(transaction);
        TransactionEntity savedEntity = transactionRepository.save(entity);
        return transactionMapper.toDomain(savedEntity);
    }

    @Override
    public Transaction findTransactionById(String transactionId) {
        Optional<TransactionEntity> entityOpt = transactionRepository.findById(transactionId);
        return entityOpt.map(transactionMapper::toDomain).orElse(null);
    }

    @Override
    public Page<Transaction> findAllTransactions(Pageable pageable) {
        return transactionRepository.findAll(pageable).map(transactionMapper::toDomain);
    }

    @Override
    public Transaction updateTransaction(String transactionId, Transaction transaction) {
        if (!transactionRepository.existsById(transactionId)) {
            throw new GlobalErrorException(String.format(
                Constants.TRANSACTION_NOT_FOUND, transactionId),
                "updateTransaction", HttpStatus.NOT_FOUND);
        }
        TransactionEntity entity = transactionMapper.toEntity(transaction);


        GetDepositAccountByIdResponse account = accountApi.getDepositAccountById
            (transaction.getAccountNumber()).getBody();

        TransactionEntity updatedEntity = transactionRepository.save(entity);
        return transactionMapper.toDomain(updatedEntity);
    }

    @Override
    public void deleteTransactionById(String transactionId) {
        transactionRepository.deleteById(transactionId);
    }

    public TransactionEntity findByIdEntity(String transactionId) {
        return transactionRepository.findById(transactionId).orElse(null);
    }

    @Override
    public List<Transaction> findByAccountNumber(String accountNumber){
        List<TransactionEntity> transactionList= transactionRepository.findByAccountNumber(accountNumber);
        return transactionList.stream()
            .map(transactionMapper::toDomain)
            .toList();
    }
}