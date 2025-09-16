package com.pichincha.account.transaction.repository;

import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionEntity;
import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionTypeEntity;
import com.pichincha.account.transaction.infrastructure.output.repository.mapper.TransactionMapperImpl;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class TransactionMapperImplTest {

  private final TransactionMapperImpl mapper = new TransactionMapperImpl();

  @Test
  void testToDomainMapsAllFields() {
    TransactionTypeEntity type = new TransactionTypeEntity();
    type.setId(5L);
    type.setDescription("Depósito");

    TransactionEntity entity = new TransactionEntity();
    entity.setTransactionId("T123");
    entity.setAccountNumber("ACC001");
    entity.setTransactionValue(100.0);
    entity.setBalance(500.0);
    entity.setTransactionDate(LocalDateTime.of(2024, 6, 10, 10, 0));
    entity.setStatus(true);
    entity.setTransactionType(type);

    Transaction tx = mapper.toDomain(entity);

    assertEquals("T123", tx.getTransactionId());
    assertEquals("ACC001", tx.getAccountNumber());
    assertEquals(100.0, tx.getTransactionValue());
    assertEquals(500.0, tx.getBalance());
    assertEquals("2024-06-10T10:00:00", tx.getTransactionDate());
    assertTrue(tx.getStatus());
    assertEquals(5L, tx.getTransactionTypeId());
    assertEquals("Depósito", tx.getTransactionTypeDescription());
  }

  @Test
  void testToDomainWithNullEntityReturnsNull() {
    assertNull(mapper.toDomain(null));
  }

  @Test
  void testToDomainWithNullTransactionType() {
    TransactionEntity entity = new TransactionEntity();
    entity.setTransactionType(null);

    Transaction tx = mapper.toDomain(entity);

    assertNull(tx.getTransactionTypeId());
    assertNull(tx.getTransactionTypeDescription());
  }

  @Test
  void testToEntityMapsAllFields() {
    Transaction tx = new Transaction();
    tx.setTransactionId("T456");
    tx.setAccountNumber("ACC002");
    tx.setTransactionValue(200.0);
    tx.setBalance(600.0);
    tx.setTransactionDate("2024-06-11T11:00:00");
    tx.setStatus(false);
    tx.setTransactionTypeId(7L);

    TransactionEntity entity = mapper.toEntity(tx);

    assertEquals("T456", entity.getTransactionId());
    assertEquals("ACC002", entity.getAccountNumber());
    assertEquals(200.0, entity.getTransactionValue());
    assertEquals(600.0, entity.getBalance());
    assertEquals(LocalDateTime.of(2024, 6, 11, 11, 0), entity.getTransactionDate());
    assertFalse(entity.getStatus());
    assertNotNull(entity.getTransactionType());
    assertEquals(7L, entity.getTransactionType().getId());
  }

  @Test
  void testToEntityWithNullTransactionReturnsNull() {
    assertNull(mapper.toEntity(null));
  }

}
