package com.pichincha.deposit.account.repository;

import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountEntity;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountTypeEntity;
import com.pichincha.deposit.account.infrastructure.output.repository.mapper.AccountMapper;
import com.pichincha.deposit.account.infrastructure.output.repository.mapper.AccountMapperImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AccountMapperTest {

  private final AccountMapper mapper = new AccountMapperImpl();

  @Test
  void testToDomain() {
    AccountTypeEntity typeEntity = new AccountTypeEntity();
    typeEntity.setId(10L);
    typeEntity.setDescription("Ahorros");

    AccountEntity entity = new AccountEntity();
    entity.setAccountNumber("123");
    entity.setAccountType(typeEntity);

    Account account = mapper.toDomain(entity);

    assertEquals(typeEntity.getId(), account.getAccountTypeId());
    assertEquals(typeEntity.getDescription(), account.getAccountTypeDescription());
    assertEquals(entity.getAccountNumber(), account.getAccountNumber());
  }

  @Test
  void testToEntity() {
    Account account = new Account();
    account.setAccountTypeId(20L);
    account.setAccountNumber("456");

    AccountEntity entity = mapper.toEntity(account);

    assertEquals(account.getAccountTypeId(), entity.getAccountType().getId());
    assertEquals(account.getAccountNumber(), entity.getAccountNumber());
  }

  @Test
  void testMapLongToAccountTypeEntity() {
    AccountTypeEntity type = mapper.map(5L);
    assertNotNull(type);
    assertEquals(5L, type.getId());

    assertNull(mapper.map((Long) null));
  }

  @Test
  void testMapAccountTypeEntityToLong() {
    AccountTypeEntity type = new AccountTypeEntity();
    type.setId(7L);
    assertEquals(7L, mapper.map(type));

    assertNull(mapper.map((AccountTypeEntity) null));
  }

}
