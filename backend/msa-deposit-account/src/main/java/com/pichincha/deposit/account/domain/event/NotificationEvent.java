package com.pichincha.deposit.account.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
  private String email;
  private String subject;
  private String accountNumber;
  private String clientName;
  private String accountType;
  private NotificationEventType eventType;
}
