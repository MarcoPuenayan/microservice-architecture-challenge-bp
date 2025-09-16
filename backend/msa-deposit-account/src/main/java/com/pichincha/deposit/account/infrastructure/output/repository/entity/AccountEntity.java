package com.pichincha.deposit.account.infrastructure.output.repository.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "accounts")
public class AccountEntity {
    @Id
    private String accountNumber;
    @ManyToOne
    @JoinColumn(name = "account_type_id", referencedColumnName = "id")
    private AccountTypeEntity accountType;
    private Double initialBalance;
    private String customerId;
    private Boolean status;
}