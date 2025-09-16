package com.pichincha.deposit.account.application.service;

import static com.pichincha.deposit.account.domain.event.NotificationEventType.ACCOUNT_CREATED;
import static com.pichincha.deposit.account.domain.utils.Constants.MAIL_NOTIFICATION;
import static com.pichincha.deposit.account.domain.utils.Constants.SUCCESSFUL_ACCOUNT_CREATION;
import static com.pichincha.deposit.account.infrastructure.input.adapter.rest.config.RabbitMqProperties.EXCHANGE;
import static com.pichincha.deposit.account.infrastructure.input.adapter.rest.config.RabbitMqProperties.ROUTING_KEY;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.input.port.CreateAccountUseCase;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.output.port.AccountTypeRepositoryPort;
import com.pichincha.deposit.account.domain.event.NotificationEvent;
import com.pichincha.deposit.account.domain.event.NotificationEventFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.domain.utils.Constants;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class CreateAccountServiceImpl implements CreateAccountUseCase {

  private final AccountRepositoryPort accountRepositoryPort;
  private final AccountTypeRepositoryPort accountTypeRepositoryPort;
  private final DomainApiClient customerApiClient;
  private final RabbitTemplate rabbitTemplate;

  @Override
  public Account createAccount(Account account) {
    log.info("Start creating account. AccountNumber={}, ClientId={}, AccountTypeId={}",
        account.getAccountNumber(), account.getCustomerId(), account.getAccountTypeId());

    GetCustomerProfilesByIdResponse getCustomerProfilesByIdResponse = customerApiClient.getCustomerProfilesById(
        UUID.fromString(account.getCustomerId())).getBody();

    var existingType = accountTypeRepositoryPort.findAccountTypeById(account.getAccountTypeId());

    accountRepositoryPort.findByAccountNumberAndAccountType(account.getAccountNumber(), account.getAccountTypeId())
        .ifPresent(existing -> {
          log.warn("Account already exists. AccountNumber={}, AccountType={}",
              account.getAccountNumber(), existingType.getDescription());
          throw new GlobalErrorException(
              String.format(Constants.ACCOUNT_ALREADY_EXISTS, account.getAccountNumber(), existingType.getDescription()),
              "createAccount", HttpStatus.CONFLICT
          );
        });

    account.setStatus(true);

    Account createAccount = accountRepositoryPort.createAccount(account);
    assert getCustomerProfilesByIdResponse != null;
    createAccount.setCustomerName(getCustomerProfilesByIdResponse.getName());
    log.info("Account created successfully with number: {}", createAccount.getAccountNumber());

    //Envio de correo
    NotificationEvent event = NotificationEventFactory.buildAccountEvent(
        MAIL_NOTIFICATION, SUCCESSFUL_ACCOUNT_CREATION, createAccount.getAccountNumber(),
        createAccount.getCustomerName(), createAccount.getAccountTypeDescription(), ACCOUNT_CREATED
    );

    rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, event);
    //

    return createAccount;
  }

}
