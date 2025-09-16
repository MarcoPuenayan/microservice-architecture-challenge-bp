package com.pichincha.deposit.account.infrastructure.output.repository.mapper;

import com.pichincha.deposit.account.domain.model.AccountType;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountTypeEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountTypeMapper {
  AccountType toDomain(AccountTypeEntity entity);
  AccountTypeEntity toEntity(AccountType accountType);
}