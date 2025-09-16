package com.pichincha.deposit.account.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Account {
    private String accountNumber;
    private Long accountTypeId;
    private String accountTypeDescription;
    private Double initialBalance;
    private String customerId;
    private String customerName;
    private Boolean status;
}