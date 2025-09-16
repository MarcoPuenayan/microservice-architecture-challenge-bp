package com.pichincha.deposit.account.infrastructure.exception.error;

import static lombok.AccessLevel.PRIVATE;

import java.io.Serializable;
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
public class ErrorErrors implements Serializable {

  static final long serialVersionUID = 2405172041950251807L;
  String code;
  String message;
  String businessMessage;

}
