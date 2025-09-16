package com.pichincha.account.transaction.application.input.port;

import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionReportResponse;
import java.util.List;

public interface FindReportTransactionsUseCase {
  GetAccountTransactionReportResponse generateReport(String clientId, String startDate, String endDate, String format);
}
