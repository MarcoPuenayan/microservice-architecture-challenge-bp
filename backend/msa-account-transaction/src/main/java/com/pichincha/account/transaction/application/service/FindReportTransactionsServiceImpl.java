package com.pichincha.account.transaction.application.service;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.transaction.application.input.port.FindReportTransactionsUseCase;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionReportResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.TransactionReport;
import com.pichincha.account.transaction.infrastructure.output.helper.PdfGenerator;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class FindReportTransactionsServiceImpl implements FindReportTransactionsUseCase {
  private final TransactionRepositoryPort transactionRepositoryPort;
  private final DomainApiClient clientRepositoryAdapter;
  private final PdfGenerator pdfGenerator;

  @Override
  @Cacheable(
      value = "generateReport",
      key = "#clientId + ':' + #startDate + ':' + #endDate + ':' + #format"
  )
  public GetAccountTransactionReportResponse generateReport(String clientId, String startDate,
      String endDate, String format) {
    log.info("Generating report for clientId={}, from {} to {}, format={}",
        clientId, startDate, endDate, format);

    List<GetDepositAccountByIdResponse> accounts = clientRepositoryAdapter
        .getDepositAccountByIdCustomer(clientId).getBody();
    assert accounts != null;

    List<TransactionReport> reports = new ArrayList<>();
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    for (GetDepositAccountByIdResponse account : accounts) {
      List<Transaction> transactions = transactionRepositoryPort
          .findByAccountNumber(account.getAccountNumber())
      .stream()
          .filter(t -> {
            LocalDate transactionDate = LocalDateTime.parse(t.getTransactionDate(),
                formatter).toLocalDate();
            return !transactionDate.isBefore(LocalDate.parse(startDate)) &&
                !transactionDate.isAfter(LocalDate.parse(endDate));
          })
          .sorted(Comparator.comparing(Transaction::getTransactionDate))
          .toList();

      for (Transaction transaction : transactions) {
        TransactionReport report = new TransactionReport();
        report.setDate(String.valueOf(LocalDateTime.parse(transaction.getTransactionDate(),
            formatter).toLocalDate()));
        report.setCustomerName(account.getCustomerName());
        report.setAccountNumber(account.getAccountNumber());
        report.setAccountTypeDescription(account.getAccountTypeDescription());
        report.setInitialBalance(transaction.getBalance());
        report.setStatus(transaction.getStatus());
        report.setTransactionValue(transaction.getTransactionValue());

        Double availableBalance = (double) 0;
        if (isWithdrawal(transaction)) {
          availableBalance = transaction.getBalance() - transaction.getTransactionValue();
          report.setTransactionValue((transaction.getTransactionValue()) * -1);
        } else {
          availableBalance = transaction.getBalance() + transaction.getTransactionValue();
        }
        report.setAvailableBalance(availableBalance);

        reports.add(report);
      }
    }

    GetAccountTransactionReportResponse response = new GetAccountTransactionReportResponse();

    if ("pdf".equalsIgnoreCase(format)) {
      log.info("Generating PDF report for clientId={}", clientId);
      byte[] pdfBytes = pdfGenerator.generatePdf(reports);
      String base64Pdf = Base64.getEncoder().encodeToString(pdfBytes);
      response.setPdfReport(base64Pdf);
      return response;
    }else{
      log.info("Returning JSON report for clientId={}", clientId);
      response.setTransactions(reports);
      return response;
    }
  }

  private boolean isWithdrawal(Transaction transaction) {
    return transaction.getTransactionTypeId() == 2;
  }
}
