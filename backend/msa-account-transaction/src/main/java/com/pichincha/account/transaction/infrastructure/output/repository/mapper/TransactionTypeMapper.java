package com.pichincha.account.transaction.infrastructure.output.repository.mapper;

import com.pichincha.account.transaction.domain.model.TransactionType;
import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionTypeEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionTypeMapper {
  TransactionType toDomain(TransactionTypeEntity entity);
  TransactionTypeEntity toEntity(TransactionType transactionType);
}