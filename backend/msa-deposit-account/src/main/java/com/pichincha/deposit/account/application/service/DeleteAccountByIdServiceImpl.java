package com.pichincha.deposit.account.application.service;

import static com.pichincha.deposit.account.domain.event.NotificationEventType.ACCOUNT_DELETED;
import static com.pichincha.deposit.account.domain.utils.Constants.MAIL_NOTIFICATION;
import static com.pichincha.deposit.account.domain.utils.Constants.SUCCESSFUL_ACCOUNT_DELETED;
import static com.pichincha.deposit.account.infrastructure.input.adapter.rest.config.RabbitMqProperties.EXCHANGE;
import static com.pichincha.deposit.account.infrastructure.input.adapter.rest.config.RabbitMqProperties.ROUTING_KEY;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.input.port.DeleteAccountByIdUseCase;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.output.port.AccountTypeRepositoryPort;
import com.pichincha.deposit.account.domain.event.NotificationEvent;
import com.pichincha.deposit.account.domain.event.NotificationEventFactory;
import com.pichincha.deposit.account.domain.event.NotificationEventType;
import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.domain.utils.Constants;
import com.pichincha.deposit.account.infrastructure.exception.GlobalErrorException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class DeleteAccountByIdServiceImpl implements DeleteAccountByIdUseCase {
  private final AccountRepositoryPort accountRepositoryPort;
  private final AccountTypeRepositoryPort accountTypeRepositoryPort;
  private final DomainApiClient customerApiClient;
  private final RabbitTemplate rabbitTemplate;

  @Override
  public void deleteAccountById(String accountId) {
    log.info("Attempting to delete account with number: {}", accountId);

    Account existing = accountRepositoryPort.findAccountById(accountId);
    if (existing == null) {
      log.warn("Account with number {} not found", accountId);
      throw new GlobalErrorException(String.format(
          String.format(Constants.ACCOUNT_NOT_FOUND, accountId)),
          "deleteAccountById", HttpStatus.NOT_FOUND);
    }

    GetCustomerProfilesByIdResponse getCustomerProfilesByIdResponse = customerApiClient.getCustomerProfilesById(
        UUID.fromString(existing.getCustomerId())).getBody();

    var existingType = accountTypeRepositoryPort.findAccountTypeById(existing.getAccountTypeId());

    accountRepositoryPort.deleteAccountById(accountId);

    //Envio de correo
    NotificationEvent event = NotificationEventFactory.buildAccountEvent(
        MAIL_NOTIFICATION, SUCCESSFUL_ACCOUNT_DELETED, accountId,
        getCustomerProfilesByIdResponse.getName(), existingType.getDescription(), ACCOUNT_DELETED
    );

    rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, event);
    //

    log.info("Successfully deleted account with number: {}", accountId);
  }
}
