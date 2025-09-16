package com.pichincha.customer.profiles.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer extends Person{
  private String customerId;
  private String password;
}
