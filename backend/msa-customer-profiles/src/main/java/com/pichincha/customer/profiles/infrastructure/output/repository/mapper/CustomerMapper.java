package com.pichincha.customer.profiles.infrastructure.output.repository.mapper;

import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.output.repository.entity.CustomerEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    Customer toDomain(CustomerEntity entity);
    CustomerEntity toEntity(Customer customer);
}
