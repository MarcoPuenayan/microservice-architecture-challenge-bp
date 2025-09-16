package com.pichincha.deposit.account.application.service;

import static com.pichincha.deposit.account.domain.event.NotificationEventType.ACCOUNT_UPDATED;
import static com.pichincha.deposit.account.domain.utils.Constants.MAIL_NOTIFICATION;
import static com.pichincha.deposit.account.domain.utils.Constants.SUCCESSFUL_ACCOUNT_UPDATED;
import static com.pichincha.deposit.account.infrastructure.input.adapter.rest.config.RabbitMqProperties.EXCHANGE;
import static com.pichincha.deposit.account.infrastructure.input.adapter.rest.config.RabbitMqProperties.ROUTING_KEY;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.GetCustomerProfilesByIdResponse;
import com.pichincha.deposit.account.application.input.port.UpdateAccountUseCase;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.output.port.AccountTypeRepositoryPort;
import com.pichincha.deposit.account.domain.event.NotificationEvent;
import com.pichincha.deposit.account.domain.event.NotificationEventFactory;
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
public class UpdateAccountServiceImpl implements UpdateAccountUseCase {
  private final AccountRepositoryPort accountRepositoryPort;
  private final AccountTypeRepositoryPort accountTypeRepositoryPort;
  private final DomainApiClient customerApiClient;
  private final RabbitTemplate rabbitTemplate;

  @Override
  public Account updateAccount(String accountId, Account updatedAccount) {
    log.info("Attempting to update account with number: {}", accountId);

    Account existingAccount = accountRepositoryPort.findAccountById(accountId);
    if (existingAccount == null) {
      log.warn("Account with number {} not found", accountId);
      throw new GlobalErrorException(String.format(
          String.format(Constants.ACCOUNT_NOT_FOUND, accountId)),
          "updateAccount", HttpStatus.NOT_FOUND);
    }

    GetCustomerProfilesByIdResponse getCustomerProfilesByIdResponse = customerApiClient.getCustomerProfilesById(
        UUID.fromString(updatedAccount.getCustomerId())).getBody();

    var existingType = accountTypeRepositoryPort.findAccountTypeById(updatedAccount.getAccountTypeId());

    existingAccount.setAccountTypeId(updatedAccount.getAccountTypeId());
    existingAccount.setInitialBalance(updatedAccount.getInitialBalance());
    existingAccount.setCustomerId(updatedAccount.getCustomerId());
    existingAccount.setStatus(updatedAccount.getStatus());

    Account saved = accountRepositoryPort.updateAccount(accountId, existingAccount);
    log.info("Successfully updated account with number: {}", accountId);

    //Envio de correo
    NotificationEvent event = NotificationEventFactory.buildAccountEvent(
        MAIL_NOTIFICATION, SUCCESSFUL_ACCOUNT_UPDATED, saved.getAccountNumber(),
        saved.getCustomerName(), saved.getAccountTypeDescription(), ACCOUNT_UPDATED
    );

    rabbitTemplate.convertAndSend(EXCHANGE, ROUTING_KEY, event);
    //

    return saved;
  }
}
