package com.pichincha.deposit.account.infrastructure.output.repository.mapper;

import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountEntity;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountTypeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(source = "accountType.id", target = "accountTypeId")
    @Mapping(source = "accountType.description", target = "accountTypeDescription")
    Account toDomain(AccountEntity entity);

    @Mapping(source = "accountTypeId", target = "accountType.id")
    AccountEntity toEntity(Account account);

    default AccountTypeEntity map(Long id) {
        if (id == null) return null;
        AccountTypeEntity type = new AccountTypeEntity();
        type.setId(id);
        return type;
    }

    default Long map(AccountTypeEntity entity) {
        return entity == null ? null : entity.getId();
    }
}
