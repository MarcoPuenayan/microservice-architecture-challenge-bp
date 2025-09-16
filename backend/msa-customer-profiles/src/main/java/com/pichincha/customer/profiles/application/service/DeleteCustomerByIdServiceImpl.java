package com.pichincha.customer.profiles.application.service;

import com.pichincha.customer.profiles.application.input.port.DeleteCustomerByIdUseCase;
import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.utils.Constants;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class DeleteCustomerByIdServiceImpl implements DeleteCustomerByIdUseCase {

  private final CustomerRepositoryPort customerRepositoryPort;

  @Override
  public void deleteCustomerById(String customerId) {
    log.info("Attempting to delete client with ID: {}", customerId);

    if (customerRepositoryPort.findCustomerById(customerId) == null) {
      log.warn("Client not found with ID: {}", customerId);
      throw new GlobalErrorException(String.format(
          String.format(Constants.CLIENT_NOT_FOUND, customerId)),
          "deleteCustomerById", HttpStatus.NOT_FOUND);
    }
    customerRepositoryPort.deleteCustomerById(customerId);
    log.info("Client with ID: {} successfully deleted", customerId);
  }

}
