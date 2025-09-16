package com.pichincha.customer.profiles.infrastructure.exception;

import static com.pichincha.customer.profiles.domain.utils.Constants.EXCEPTION_DETAIL;
import static com.pichincha.customer.profiles.domain.utils.Constants.EXCEPTION_TITLE;
import static com.pichincha.customer.profiles.infrastructure.exception.GlobalExceptionHandler.CONSTANT_SLASH;
import static lombok.AccessLevel.PRIVATE;

import com.pichincha.customer.profiles.infrastructure.exception.error.ErrorErrors;
import com.pichincha.customer.profiles.infrastructure.exception.error.Error;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@FieldDefaults(level = PRIVATE)
public class GlobalErrorException extends RuntimeException {

  final Error error;
  final HttpStatus status;

  public GlobalErrorException(String message, String component, HttpStatus status) {
    this.status = status;

    List<ErrorErrors> errors = new ArrayList<>();
    errors.add(ErrorErrors.builder()
        .code(String.valueOf(status.value()))
        .message(status.name())
        .businessMessage(message)
        .build());

    this.error = Error.builder()
        .title(EXCEPTION_TITLE)
        .detail(EXCEPTION_DETAIL)
        .errors(errors)
        .component(CONSTANT_SLASH)
        .backend(CONSTANT_SLASH)
        .build();
  }
}
