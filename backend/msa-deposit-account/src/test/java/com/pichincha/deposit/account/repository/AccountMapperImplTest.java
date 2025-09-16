package com.pichincha.deposit.account.repository;

import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountEntity;
import com.pichincha.deposit.account.infrastructure.output.repository.entity.AccountTypeEntity;
import com.pichincha.deposit.account.infrastructure.output.repository.mapper.AccountMapperImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AccountMapperImplTest {

  private final AccountMapperImpl mapper = new AccountMapperImpl();

  @Test
  void testToDomainAllFields() {
    AccountTypeEntity typeEntity = new AccountTypeEntity();
    typeEntity.setId(1L);
    typeEntity.setDescription("Corriente");

    AccountEntity entity = new AccountEntity();
    entity.setAccountNumber("123");
    entity.setAccountType(typeEntity);
    entity.setInitialBalance(100.0);
    entity.setCustomerId("CUST1");
    entity.setStatus(true);

    Account account = mapper.toDomain(entity);

    assertEquals("123", account.getAccountNumber());
    assertEquals(1L, account.getAccountTypeId());
    assertEquals("Corriente", account.getAccountTypeDescription());
    assertEquals(100.0, account.getInitialBalance());
    assertEquals("CUST1", account.getCustomerId());
    assertTrue(account.getStatus());
  }

  @Test
  void testToDomainNullEntity() {
    assertNull(mapper.toDomain(null));
  }

  @Test
  void testToDomainNullAccountType() {
    AccountEntity entity = new AccountEntity();
    entity.setAccountNumber("123");
    entity.setAccountType(null);

    Account account = mapper.toDomain(entity);

    assertNull(account.getAccountTypeId());
    assertNull(account.getAccountTypeDescription());
  }

  @Test
  void testToEntityAllFields() {
    Account account = new Account();
    account.setAccountNumber("456");
    account.setAccountTypeId(2L);
    account.setInitialBalance(200.0);
    account.setCustomerId("CUST2");
    account.setStatus(false);

    AccountEntity entity = mapper.toEntity(account);

    assertEquals("456", entity.getAccountNumber());
    assertEquals(2L, entity.getAccountType().getId());
    assertEquals(200.0, entity.getInitialBalance());
    assertEquals("CUST2", entity.getCustomerId());
    assertFalse(entity.getStatus());
  }

  @Test
  void testToEntityNullAccount() {
    assertNull(mapper.toEntity(null));
  }

}
