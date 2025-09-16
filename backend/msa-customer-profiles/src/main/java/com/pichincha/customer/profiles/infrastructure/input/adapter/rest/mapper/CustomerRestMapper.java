package com.pichincha.customer.profiles.infrastructure.input.adapter.rest.mapper;

import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.GetCustomerProfilesByIdResponse;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.GetCustomerProfilesResponse;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.PostCustomerProfilesRequest;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.PostCustomerProfilesResponse;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.PutCustomerProfilesRequest;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CustomerRestMapper {
  Customer toCustomerPost(PostCustomerProfilesRequest request);

  PostCustomerProfilesResponse toPostCustomerProfilesResponse(Customer customer);

  GetCustomerProfilesResponse toGetCustomerProfilesResponse(List<Customer> customer, int page, int size, long totalElements, int totalPages);

  GetCustomerProfilesByIdResponse toGetCustomerProfilesByIdResponse(Customer customer);

  Customer toCustomer(PutCustomerProfilesRequest request);

  List<PostCustomerProfilesResponse> toPostCustomerProfilesListResponse(List<Customer> customer);
}