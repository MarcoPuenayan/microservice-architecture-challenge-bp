package com.pichincha.customer.profiles.infrastructure.output.repository.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "customers")
public class CustomerEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String customerId;
  private String name;
  private String gender;
  private Integer age;
  private String identification;
  private String address;
  private String phone;
  private String password;
  private Boolean status;
}
