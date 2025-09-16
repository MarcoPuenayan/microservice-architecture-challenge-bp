package com.pichincha.account.transaction.domain.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    private String transactionId;
    private String accountNumber;
    private String accountDescription;
    private Long transactionTypeId;
    private String transactionTypeDescription;
    private Double transactionValue;
    private Double balance;
    private String transactionDate;
    private Boolean status;
}
