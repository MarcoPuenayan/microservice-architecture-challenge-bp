package com.pichincha.account.transaction.application.input.port;

public interface DeleteTransactionByIdUseCase {
    void deleteTransactionById(String transactionId);
}