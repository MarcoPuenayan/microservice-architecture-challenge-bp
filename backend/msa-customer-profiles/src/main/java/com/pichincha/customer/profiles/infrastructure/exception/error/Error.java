package com.pichincha.customer.profiles.infrastructure.exception.error;

import static lombok.AccessLevel.PRIVATE;

import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = PRIVATE)
public class Error implements Serializable {

  static final long serialVersionUID = 1905122041950251207L;

  String title;
  String detail;
  transient List<ErrorErrors> errors;
  String instance;
  String type;
  String resource;
  String component;
  String backend;
}
