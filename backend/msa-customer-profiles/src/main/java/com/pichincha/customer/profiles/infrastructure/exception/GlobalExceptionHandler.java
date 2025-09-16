package com.pichincha.customer.profiles.infrastructure.exception;

import static com.pichincha.customer.profiles.domain.utils.Constants.EXCEPTION_CONSTRAINT_VIOLATION_TITTLE;
import static com.pichincha.customer.profiles.domain.utils.Constants.EXCEPTION_DETAIL;
import static com.pichincha.customer.profiles.domain.utils.Constants.EXCEPTION_MESSAGE_VALIDATION;

import com.pichincha.customer.profiles.infrastructure.exception.error.ErrorErrors;
import com.pichincha.customer.profiles.infrastructure.exception.error.Error;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  public static final String CONSTANT_SLASH = "-";

  @ExceptionHandler(GlobalErrorException.class)
  public ResponseEntity handlerExceptionResource(GlobalErrorException be, HttpServletRequest request) {
    be.getError().setResource(CONSTANT_SLASH);
    be.getError().setType(CONSTANT_SLASH);
    be.getError().setInstance(CONSTANT_SLASH);
    return new ResponseEntity(be.getError(), be.getStatus());
  }

  @ExceptionHandler(ConstraintViolationException.class)
  public ResponseEntity handlerExceptionResource(ConstraintViolationException cve, HttpServletRequest request) {

    String[] exceptionMessages = cve.getMessage().split(",");
    List<ErrorErrors> errorsList = Arrays.stream(exceptionMessages)
        .map(error -> ErrorErrors.builder()
            .code(String.valueOf(HttpStatus.BAD_REQUEST.value()))
            .message(EXCEPTION_MESSAGE_VALIDATION)
            .businessMessage(error)
            .build()).toList();
    return new ResponseEntity(
        Error.builder()
            .title(EXCEPTION_CONSTRAINT_VIOLATION_TITTLE)
            .detail("The input fields are not correct")
            .type(EXCEPTION_DETAIL)
            .errors(errorsList)
            .resource(getExceptionLocation(cve))
            .type(request.getRequestURI())
            .instance(String.valueOf(HttpStatus.BAD_REQUEST.value()))
            .backend(CONSTANT_SLASH)
            .component(CONSTANT_SLASH)
            .build(),
        HttpStatus.BAD_REQUEST);
  }

  private static String getExceptionLocation(Exception ex) {
    StackTraceElement[] stackTrace = ex.getStackTrace();
    if (stackTrace.length > 0) {
      StackTraceElement element = stackTrace[0];
      String className = element.getClassName();
      String simpleClassName = className.substring(className.lastIndexOf('.') + 1);
      return simpleClassName + "/" + element.getMethodName();
    }
    return "Unknown";
  }
}
