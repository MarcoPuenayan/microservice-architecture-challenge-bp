package com.pichincha.customer.profiles.infrastructure.output.adapter;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.output.repository.CustomerRepository;
import com.pichincha.customer.profiles.infrastructure.output.repository.entity.CustomerEntity;
import com.pichincha.customer.profiles.infrastructure.output.repository.mapper.CustomerMapper;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class CustomerAdapter implements CustomerRepositoryPort {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Override
    public Customer createCustomer(Customer customer) {
        CustomerEntity entity = customerMapper.toEntity(customer);
        CustomerEntity savedEntity = customerRepository.save(entity);
        return customerMapper.toDomain(savedEntity);
    }

    @Override
    public Customer findCustomerById(String customerId) {
        Optional<CustomerEntity> entityOpt = customerRepository.findById(customerId);
        return entityOpt.map(customerMapper::toDomain).orElse(null);
    }

    @Override
    public Page<Customer> findAllCustomers(Pageable pageable) {
        return customerRepository.findAll(pageable)
            .map(customerMapper::toDomain);
    }

    @Override
    public void updateCustomer(String customerId, Customer customer) {
        CustomerEntity entity = customerMapper.toEntity(customer);
        customerRepository.save(entity);
    }

    @Override
    public void deleteCustomerById(String clientId) {
        customerRepository.deleteById(clientId);
    }

    @Override
    public Optional<Customer> findByIdentification(String identification) {
        return customerRepository.findAll().stream()
                .filter(e -> e.getIdentification().equals(identification))
                .findFirst()
                .map(customerMapper::toDomain);
    }

    @Override
    public List<Customer> findAllByCustomerIdIn(List<String> ids) {
        List<CustomerEntity> entities = customerRepository.findAllByCustomerIdIn(ids);
        return entities.stream()
            .map(customerMapper::toDomain)
            .toList();
    }

}

