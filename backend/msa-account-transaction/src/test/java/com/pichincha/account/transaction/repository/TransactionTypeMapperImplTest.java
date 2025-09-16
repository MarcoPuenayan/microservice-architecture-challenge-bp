package com.pichincha.account.transaction.repository;

import com.pichincha.account.transaction.domain.model.TransactionType;
import com.pichincha.account.transaction.infrastructure.output.repository.entity.TransactionTypeEntity;
import com.pichincha.account.transaction.infrastructure.output.repository.mapper.TransactionTypeMapperImpl;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class TransactionTypeMapperImplTest {

  private final TransactionTypeMapperImpl mapper = new TransactionTypeMapperImpl();

  @Test
  void testToDomainMapsAllFields() {
    String description = "Retiro";
    TransactionTypeEntity entity = new TransactionTypeEntity();
    entity.setId(10L);
    entity.setDescription(description);

    TransactionType type = mapper.toDomain(entity);

    assertEquals(10L, type.getId());
    assertEquals(description, type.getDescription());
  }

  @Test
  void testToDomainWithNullEntityReturnsNull() {
    assertNull(mapper.toDomain(null));
  }

  @Test
  void testToEntityMapsAllFields() {
    String description = "Depósito";
    TransactionType type = new TransactionType();
    type.setId(20L);
    type.setDescription(description);

    TransactionTypeEntity entity = mapper.toEntity(type);

    assertEquals(20L, entity.getId());
    assertEquals(description, entity.getDescription());
  }

  @Test
  void testToEntityWithNullTypeReturnsNull() {
    assertNull(mapper.toEntity(null));
  }

}
