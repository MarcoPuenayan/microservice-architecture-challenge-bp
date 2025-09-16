package com.pichincha.customer.profiles.application.service;

import com.pichincha.customer.profiles.application.input.port.CreateCustomerUseCase;
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
public class CreateCustomerServiceImpl implements CreateCustomerUseCase {

    private final CustomerRepositoryPort customerRepositoryPort;

    @Override
    public Customer createCustomer(Customer customer) {
        log.info("Creating customer with identification: {}", customer.getIdentification());
        customerRepositoryPort.findByIdentification(customer.getIdentification())
                .ifPresent(existing -> {
                    throw new GlobalErrorException(String.format(
                        Constants.CLIENT_ALREADY_EXISTS, customer.getIdentification()),
                        "createCustomer", HttpStatus.CONFLICT);
                });

        customer.setStatus(true);
        Customer createCustomer = customerRepositoryPort.createCustomer(customer);
        log.info("Customer created successfully with ID: {}", createCustomer.getCustomerId());
        return createCustomer;
    }
}
