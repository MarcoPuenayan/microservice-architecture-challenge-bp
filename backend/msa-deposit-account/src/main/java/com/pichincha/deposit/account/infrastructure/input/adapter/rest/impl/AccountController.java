package com.pichincha.deposit.account.infrastructure.input.adapter.rest.impl;

import static lombok.AccessLevel.PRIVATE;

import com.pichincha.common.domain.EventType;
import com.pichincha.common.domain.LoggerAttributes;
import com.pichincha.common.domain.Strategy;
import com.pichincha.common.service.LoggerAuditorService;
import com.pichincha.deposit.account.application.input.port.CreateAccountUseCase;
import com.pichincha.deposit.account.application.input.port.DeleteAccountByIdUseCase;
import com.pichincha.deposit.account.application.input.port.FindAccountByIdUseCase;
import com.pichincha.deposit.account.application.input.port.FindAllAccountsUseCase;
import com.pichincha.deposit.account.application.input.port.UpdateAccountUseCase;
import com.pichincha.deposit.account.application.service.FindAccountCustomerByIdServiceImpl;
import com.pichincha.deposit.account.application.service.FindAccountsByIdListServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.DomainApi;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.mapper.AccountRestMapper;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.GetDepositAccountByIdResponse;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.GetDepositAccountResponse;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.PostDepositAccountRequest;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.PostDepositAccountResponse;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.PutDepositAccountRequest;
import java.security.SecureRandom;
import java.util.List;
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
public class AccountController implements DomainApi {
  private final CreateAccountUseCase createAccountUseCase;
  private final FindAllAccountsUseCase findAllAccountsUseCase;
  private final FindAccountByIdUseCase findAccountByIdUseCase;
  private final DeleteAccountByIdUseCase deleteAccountByIdUseCase;
  private final UpdateAccountUseCase updateAccountUseCase;
  private final FindAccountCustomerByIdServiceImpl findAccountCustomerByIdService;
  private final FindAccountsByIdListServiceImpl accountService;
  private final AccountRestMapper accountRestMapper;
  public final LoggerAuditorService loggerAuditor;

  @Override
  @PostMapping
  public ResponseEntity<PostDepositAccountResponse> postDepositAccount(@RequestBody PostDepositAccountRequest request) {
    Account account = accountRestMapper.toDomain(request);
    Account createdAccount = createAccountUseCase.createAccount(account);
    PostDepositAccountResponse response = accountRestMapper.toResponse(createdAccount);
    loggerAuditor(request, HttpStatus.CREATED, "postDepositAccount");
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  @GetMapping
  public ResponseEntity<GetDepositAccountResponse> getDepositAccount(Integer page, Integer limit) {
    Pageable pageable = (page == null || limit == null) ? Pageable.unpaged() : PageRequest.of(page, limit);
    Page<Account> accountPage = findAllAccountsUseCase.findAllAccounts(pageable);

    if (accountPage.getContent().isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    GetDepositAccountResponse response = accountRestMapper.toGetCustomerProfilesResponse(
        accountPage.getContent(),
        accountPage.getNumber(),
        accountPage.getSize(),
        accountPage.getTotalElements(),
        accountPage.getTotalPages()
    );
    loggerAuditor(response.getAccounts(), HttpStatus.OK, "getDepositAccount");
    return ResponseEntity.ok(response);
  }

  @Override
  @GetMapping("/{accountId}")
  public ResponseEntity<GetDepositAccountByIdResponse> getDepositAccountById(@PathVariable String accountId) {
    Account account = findAccountByIdUseCase.findAccountById(accountId);
    loggerAuditor(account, HttpStatus.OK, "getDepositAccountById");
    return ResponseEntity.ok(accountRestMapper.toGetDepositAccountByIdResponse(account));
  }

  @Override
  @PutMapping("/{accountId}")
  public ResponseEntity<Void> putDepositAccount(@PathVariable String accountId, @RequestBody PutDepositAccountRequest request) {
    Account account = accountRestMapper.toAccount(request);
    updateAccountUseCase.updateAccount(accountId, account);
    loggerAuditor(request, HttpStatus.NO_CONTENT, "putDepositAccount");
    return ResponseEntity.noContent().build();
  }

  @Override
  @DeleteMapping("/{accountId}")
  public ResponseEntity<Void> deleteDepositAccount(@PathVariable String accountId) {
    deleteAccountByIdUseCase.deleteAccountById(accountId);
    return ResponseEntity.noContent().build();
  }

  @Override
  @GetMapping("/by-customer/{customerId}")
  public ResponseEntity<List<GetDepositAccountByIdResponse>> getDepositAccountByIdCustomer(
      @PathVariable String customerId) {
    List<Account> customerList = findAccountCustomerByIdService.getAccountsByCustomerId(customerId);
    return ResponseEntity.ok(accountRestMapper.toGetDepositAccountByIdListResponse(customerList));
  }

  @Override
  @PostMapping("/batch-retrieve")
  public ResponseEntity<List<PostDepositAccountResponse>> postDepositAccountBatch
      (@RequestBody List<String> accountNumbers) {
    List<Account> customerList = accountService.findAllByAccountNumberIn(accountNumbers);
    return ResponseEntity.ok(accountRestMapper.toPostDepositAccountResponse(customerList));
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
