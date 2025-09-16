package com.pichincha.account.transaction.infrastructure.output.repository.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Data;

@Data
@Entity
@Table(name = "transactions")
public class TransactionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String transactionId;
    private String accountNumber;
    @ManyToOne
    @JoinColumn(name = "transaction_type_id", referencedColumnName = "id")
    private TransactionTypeEntity transactionType;

    private Double transactionValue;
    private Double balance;
    private LocalDateTime transactionDate;

    private Boolean status;
}