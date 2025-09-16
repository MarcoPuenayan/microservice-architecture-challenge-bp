package com.pichincha.account.transaction.infrastructure.output.repository.mapper;

import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(source = "transactionType.id", target = "transactionTypeId")
    @Mapping(source = "transactionType.description", target = "transactionTypeDescription")
    Transaction toDomain(TransactionEntity entity);

    @Mapping(source = "transactionTypeId", target = "transactionType.id")
    TransactionEntity toEntity(Transaction transaction);
}
