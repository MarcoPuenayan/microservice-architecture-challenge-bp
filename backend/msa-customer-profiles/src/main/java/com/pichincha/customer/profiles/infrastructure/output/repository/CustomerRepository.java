package com.pichincha.customer.profiles.infrastructure.output.repository;

import com.pichincha.customer.profiles.infrastructure.output.repository.entity.CustomerEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<CustomerEntity, String> {
    Optional<CustomerEntity> findByIdentification(String identification);
    List<CustomerEntity> findAllByCustomerIdIn(List<String> customerIds);
}
