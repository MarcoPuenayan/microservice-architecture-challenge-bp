package com.pichincha.customer.profiles.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Person {
  private String name;
  private String gender;
  private Integer age;
  private String identification;
  private String address;
  private String phone;
  private Boolean status;
}
