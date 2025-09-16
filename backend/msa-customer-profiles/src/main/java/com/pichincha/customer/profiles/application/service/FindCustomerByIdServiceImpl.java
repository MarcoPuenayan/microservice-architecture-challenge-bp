package com.pichincha.customer.profiles.application.service;

import com.pichincha.customer.profiles.application.input.port.FindCustomerByIdUseCase;
import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.domain.utils.Constants;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindCustomerByIdServiceImpl implements FindCustomerByIdUseCase {

  private final CustomerRepositoryPort customerRepositoryPort;

  @Override
  @Cacheable("findCustomerById")
  public Customer findCustomerById(String customerId) {
    log.info("Retrieving client with ID: {}", customerId);

    Customer customer = customerRepositoryPort.findCustomerById(customerId);
    if (customer == null) {
      log.warn("Client not found with ID: {}", customerId);
      throw new GlobalErrorException(String.format(
          String.format(Constants.CLIENT_NOT_FOUND, customerId)),
          "findCustomerById", HttpStatus.NOT_FOUND);
    }
    log.info("Client with ID: {} successfully retrieved", customerId);
    return customer;
  }

}
