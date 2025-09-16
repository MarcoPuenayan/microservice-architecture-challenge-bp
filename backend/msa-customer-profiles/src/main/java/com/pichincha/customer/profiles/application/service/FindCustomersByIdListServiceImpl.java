package com.pichincha.customer.profiles.application.service;

import com.pichincha.customer.profiles.application.output.port.CustomerRepositoryPort;
import com.pichincha.customer.profiles.domain.model.Customer;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindCustomersByIdListServiceImpl {
  private final CustomerRepositoryPort customerRepositoryPort;

  @Cacheable("findCustomersByIds")
  public List<Customer> findCustomersByIds(List<String> ids) {
    log.info("Fetching all customers by ids from DB...");
    return customerRepositoryPort.findAllByCustomerIdIn(ids);
  }
}
