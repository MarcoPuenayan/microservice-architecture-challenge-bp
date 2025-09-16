package com.pichincha.account.transaction.infrastructure.input.adapter.rest.mapper;

import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionByIdResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.PostAccountTransactionRequest;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.PostAccountTransactionResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.PutAccountTransactionRequest;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TransactionRestMapper {
  Transaction toDomain(PostAccountTransactionRequest request);
  PostAccountTransactionResponse toResponse(Transaction transaction);

  GetAccountTransactionResponse toGetAccountTransactionResponse(List<Transaction> transactions, int page, int size, long totalElements, int totalPages);

  GetAccountTransactionByIdResponse toGetAccountTransactionByIdResponse(Transaction transaction);

  Transaction toTransaction(PutAccountTransactionRequest request);
}
