package com.pichincha.customer.profiles.application.service;

import com.pichincha.customer.profiles.application.input.port.FindAllCustomersUseCase;
import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.model.Customer;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindAllCustomersServiceImpl implements FindAllCustomersUseCase {
    private final CustomerRepositoryPort customerRepositoryPort;

    @Override
    //@Cacheable("findAllCustomers")
    public Page<Customer> findAllCustomers(Pageable pageable) {
        log.info("Fetching all customers from DB...");
        return customerRepositoryPort.findAllCustomers(pageable);
    }
}