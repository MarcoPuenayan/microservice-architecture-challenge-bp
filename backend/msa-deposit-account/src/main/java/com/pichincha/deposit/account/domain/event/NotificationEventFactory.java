package com.pichincha.deposit.account.domain.event;

public class NotificationEventFactory {

  public static NotificationEvent buildAccountEvent(
      String email,
      String subject,
      String accountNumber,
      String clientName,
      String accountType,
      NotificationEventType eventType
  ) {
    return NotificationEvent.builder()
        .email(email)
        .subject(subject)
        .accountNumber(accountNumber)
        .clientName(clientName)
        .accountType(accountType)
        .eventType(eventType)
        .build();
  }

}
