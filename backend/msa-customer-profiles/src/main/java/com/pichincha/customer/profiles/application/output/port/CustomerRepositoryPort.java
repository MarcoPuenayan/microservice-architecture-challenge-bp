package com.pichincha.customer.profiles.application.output.port;

import com.pichincha.customer.profiles.domain.model.Customer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerRepositoryPort {
    Customer createCustomer(Customer customer);
    Customer findCustomerById(String customerId);
    Page<Customer> findAllCustomers(Pageable pageable);
    void updateCustomer(String customerId, Customer customer);
    void deleteCustomerById(String customerId);
    Optional<Customer> findByIdentification(String identification);
    List<Customer> findAllByCustomerIdIn(List<String> customerIds);
}
