package com.pichincha.customer.profiles.repository;

import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.output.repository.entity.CustomerEntity;
import com.pichincha.customer.profiles.infrastructure.output.repository.mapper.CustomerMapperImpl;
import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

public class CustomerMapperImplTest {

  private final CustomerMapperImpl mapper = new CustomerMapperImpl();

  @Test
  void toDomain_mapsAllFieldsCorrectly() {
    CustomerEntity entity = new CustomerEntity();
    entity.setCustomerId("ID123");
    entity.setName("Juan");
    entity.setGender("Masculino");
    entity.setAge(35);
    entity.setIdentification("1234567890");
    entity.setAddress("Calle 1");
    entity.setPhone("0999999999");
    entity.setPassword("pass");
    entity.setStatus(true);

    Customer customer = mapper.toDomain(entity);

    assertThat(customer.getCustomerId()).isEqualTo(entity.getCustomerId());
    assertThat(customer.getName()).isEqualTo(entity.getName());
    assertThat(customer.getGender()).isEqualTo(entity.getGender());
    assertThat(customer.getAge()).isEqualTo(entity.getAge());
    assertThat(customer.getIdentification()).isEqualTo(entity.getIdentification());
    assertThat(customer.getAddress()).isEqualTo(entity.getAddress());
    assertThat(customer.getPhone()).isEqualTo(entity.getPhone());
    assertThat(customer.getPassword()).isEqualTo(entity.getPassword());
    assertThat(customer.getStatus()).isEqualTo(entity.getStatus());
  }

  @Test
  void toEntity_mapsAllFieldsCorrectly() {
    Customer customer = new Customer();
    customer.setCustomerId("ID456");
    customer.setName("Maria");
    customer.setGender("Femenino");
    customer.setAge(28);
    customer.setIdentification("0987654321");
    customer.setAddress("Calle 2");
    customer.setPhone("0888888888");
    customer.setPassword("secret");
    customer.setStatus(false);

    CustomerEntity entity = mapper.toEntity(customer);

    assertThat(entity.getCustomerId()).isEqualTo(customer.getCustomerId());
    assertThat(entity.getName()).isEqualTo(customer.getName());
    assertThat(entity.getGender()).isEqualTo(customer.getGender());
    assertThat(entity.getAge()).isEqualTo(customer.getAge());
    assertThat(entity.getIdentification()).isEqualTo(customer.getIdentification());
    assertThat(entity.getAddress()).isEqualTo(customer.getAddress());
    assertThat(entity.getPhone()).isEqualTo(customer.getPhone());
    assertThat(entity.getPassword()).isEqualTo(customer.getPassword());
    assertThat(entity.getStatus()).isEqualTo(customer.getStatus());
  }

}
