package com.pichincha.customer.profiles.infrastructure.input.adapter.rest.impl;

import static lombok.AccessLevel.PRIVATE;

import com.pichincha.common.domain.EventType;
import com.pichincha.common.domain.LoggerAttributes;
import com.pichincha.common.domain.Strategy;
import com.pichincha.common.service.LoggerAuditorService;
import com.pichincha.customer.profiles.application.input.port.CreateCustomerUseCase;
import com.pichincha.customer.profiles.application.input.port.DeleteCustomerByIdUseCase;
import com.pichincha.customer.profiles.application.input.port.FindAllCustomersUseCase;
import com.pichincha.customer.profiles.application.input.port.FindCustomerByIdUseCase;
import com.pichincha.customer.profiles.application.input.port.UpdateCustomerUseCase;
import com.pichincha.customer.profiles.application.service.FindCustomersByIdListServiceImpl;
import com.pichincha.customer.profiles.domain.model.Customer;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.DomainApi;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.mapper.CustomerRestMapper;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.GetCustomerProfilesByIdResponse;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.GetCustomerProfilesResponse;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.PostCustomerProfilesRequest;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.PostCustomerProfilesResponse;
import com.pichincha.customer.profiles.infrastructure.input.adapter.rest.models.PutCustomerProfilesRequest;
import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class CustomerController implements DomainApi {

    private final CreateCustomerUseCase createCustomerUseCase;
    private final FindAllCustomersUseCase findAllCustomersUseCase;
    private final FindCustomerByIdUseCase findCustomerByIdUseCase;
    private final DeleteCustomerByIdUseCase deleteCustomerByIdUseCase;
    private final UpdateCustomerUseCase updateCustomerUseCase;
    private final FindCustomersByIdListServiceImpl customerProfileService;
    private final CustomerRestMapper customerMapper;
    public final LoggerAuditorService loggerAuditor;

    @Override
    @PostMapping
    public ResponseEntity<PostCustomerProfilesResponse> postCustomerProfiles(@RequestBody PostCustomerProfilesRequest request) {
        Customer customer = customerMapper.toCustomerPost(request);
        Customer created = createCustomerUseCase.createCustomer(customer);
        PostCustomerProfilesResponse response = customerMapper.toPostCustomerProfilesResponse(created);
        loggerAuditor(response, HttpStatus.CREATED, "postCustomerProfiles");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @Override
    @GetMapping
    public ResponseEntity<GetCustomerProfilesResponse> getCustomerProfiles(Integer page, Integer limit) {
        Pageable pageable = (page == null || limit == null) ? Pageable.unpaged() : PageRequest.of(page, limit);
        Page<Customer> customerPage = findAllCustomersUseCase.findAllCustomers(pageable);

        if (customerPage.getContent().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        GetCustomerProfilesResponse response = customerMapper.toGetCustomerProfilesResponse(
            customerPage.getContent(),
            customerPage.getNumber(),
            customerPage.getSize(),
            customerPage.getTotalElements(),
            customerPage.getTotalPages()
        );
        loggerAuditor(response.getCustomer(), HttpStatus.OK, "getCustomerProfiles");
        return ResponseEntity.ok(response);
    }

    @Override
    @GetMapping("/{customerId}")
    public ResponseEntity<GetCustomerProfilesByIdResponse> getCustomerProfilesById(@PathVariable UUID customerId) {
        Customer customer = findCustomerByIdUseCase.findCustomerById(String.valueOf(customerId));
        loggerAuditor(customer, HttpStatus.OK, "getCustomerProfilesById");
        return ResponseEntity.ok(customerMapper.toGetCustomerProfilesByIdResponse(customer));
    }

    @Override
    @PutMapping("/{customerId}")
    public ResponseEntity<Void> putCustomerProfiles(@PathVariable UUID customerId, @RequestBody PutCustomerProfilesRequest customerRequest) {
        Customer client = customerMapper.toCustomer(customerRequest);
        updateCustomerUseCase.updateCustomer(String.valueOf(customerId), client);
        loggerAuditor(client, HttpStatus.NO_CONTENT, "putCustomerProfiles");
        return ResponseEntity.noContent().build();
    }

    @Override
    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomerProfiles(@PathVariable UUID customerId) {
        deleteCustomerByIdUseCase.deleteCustomerById(String.valueOf(customerId));
        return ResponseEntity.noContent().build();
    }

    @Override
    @PostMapping("/batch-retrieve")
    public ResponseEntity<List<PostCustomerProfilesResponse>> postCustomerProfilesBatch
        (@RequestBody List<String> customerIds) {
        List<Customer> customerList = customerProfileService.findCustomersByIds(customerIds);
        return ResponseEntity.ok(customerMapper.toPostCustomerProfilesListResponse(customerList));
    }

    public void loggerAuditor(Object personDto, HttpStatus httpStatus,
        String nameMethod) {
        SecureRandom secureRandomString = new SecureRandom();
        int idTransactionalString = secureRandomString.nextInt();
        loggerAuditor.log(LoggerAttributes.builder().type(EventType.REQUEST)
            .object(personDto)
            .transactionId(String.valueOf(idTransactionalString))
            .component(nameMethod + idTransactionalString)
            .mode(Strategy.EXTERNAL)
            .statusCode(httpStatus.value())
            .build());
    }

}
