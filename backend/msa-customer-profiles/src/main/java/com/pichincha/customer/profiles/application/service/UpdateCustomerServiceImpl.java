package com.pichincha.customer.profiles.application.service;

import com.pichincha.customer.profiles.application.input.port.UpdateCustomerUseCase;
import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.domain.utils.Constants;
import com.pichincha.customer.profiles.infrastructure.exception.GlobalErrorException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class UpdateCustomerServiceImpl implements UpdateCustomerUseCase {

  private final CustomerRepositoryPort customerRepositoryPort;

  @Override
  public void updateCustomer(String customerId, Customer customer) {
    log.info("Updating client with ID: {}", customerId);

    Customer existingClient = customerRepositoryPort.findCustomerById(customerId);
    if (existingClient == null) {
      log.warn("Client not found with ID: {}", customerId);
      throw new GlobalErrorException(String.format(
          String.format(Constants.CLIENT_NOT_FOUND, customerId)),
          "deleteCustomerById", HttpStatus.NOT_FOUND);
    }

    existingClient.setName(customer.getName());
    existingClient.setGender(customer.getGender());
    existingClient.setAge(customer.getAge());
    existingClient.setIdentification(customer.getIdentification());
    existingClient.setAddress(customer.getAddress());
    existingClient.setPhone(customer.getPhone());
    existingClient.setPassword(customer.getPassword());
    existingClient.setStatus(customer.getStatus());

    customerRepositoryPort.updateCustomer(customerId, existingClient);
    log.info("Client with ID: {} successfully updated", customerId);
  }

}
