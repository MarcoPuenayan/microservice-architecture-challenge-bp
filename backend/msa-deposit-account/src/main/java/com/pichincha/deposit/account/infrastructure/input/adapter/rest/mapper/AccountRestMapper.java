package com.pichincha.deposit.account.infrastructure.input.adapter.rest.mapper;

import com.pichincha.deposit.account.domain.model.Account;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.GetDepositAccountByIdResponse;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.GetDepositAccountResponse;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.PostDepositAccountRequest;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.PostDepositAccountResponse;
import com.pichincha.deposit.account.infrastructure.input.adapter.rest.models.PutDepositAccountRequest;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AccountRestMapper {
  PostDepositAccountResponse toResponse(Account account);
  Account toDomain(PostDepositAccountRequest response);

  GetDepositAccountResponse toGetCustomerProfilesResponse(List<Account> accounts, int page, int size, long totalElements, int totalPages);

  GetDepositAccountByIdResponse toGetDepositAccountByIdResponse(Account account);

  Account toAccount(PutDepositAccountRequest request);

  List<GetDepositAccountByIdResponse> toGetDepositAccountByIdListResponse(List<Account> account);

  List<PostDepositAccountResponse> toPostDepositAccountResponse(List<Account> account);
}
