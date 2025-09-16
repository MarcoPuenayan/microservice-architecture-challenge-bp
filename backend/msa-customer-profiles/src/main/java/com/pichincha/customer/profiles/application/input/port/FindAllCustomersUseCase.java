package com.pichincha.customer.profiles.application.input.port;

import com.pichincha.customer.profiles.domain.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FindAllCustomersUseCase {
    Page<Customer> findAllCustomers(Pageable pageable);
}
