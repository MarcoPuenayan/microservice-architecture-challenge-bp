package com.pichincha.customer.profiles.application.input.port;

import com.pichincha.customer.profiles.domain.model.Customer;

public interface UpdateCustomerUseCase {
    void updateCustomer(String customerId, Customer customer);
}
