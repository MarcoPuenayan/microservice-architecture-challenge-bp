package com.pichincha.account.transaction.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.account.accounts.api.DomainApiClient;
import com.pichincha.account.accounts.models.GetDepositAccountByIdResponse;
import com.pichincha.account.transaction.application.service.FindReportTransactionsServiceImpl;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionReportResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.TransactionReport;
import com.pichincha.account.transaction.infrastructure.output.helper.PdfGenerator;
import com.pichincha.account.transaction.application.output.port.TransactionRepositoryPort;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import org.springframework.http.ResponseEntity;

public class FindReportTransactionsServiceImplTest {

  @Mock
  private TransactionRepositoryPort transactionRepositoryPort;
  @Mock
  private DomainApiClient clientRepositoryAdapter;
  @Mock
  private PdfGenerator pdfGenerator;

  @InjectMocks
  private FindReportTransactionsServiceImpl service;

  GetDepositAccountByIdResponse account;
  Transaction depositTx;
  Transaction withdrawalTx;

  String accountId;
  String customerId;
  String customerName;
  String formato;
  String startDate;
  String endDate;

  @BeforeEach
  void setUp() {
    accountId = "123";
    customerId = "cli1";
    customerName = "Juan Perez";
    formato = "json";
    startDate = "2024-06-01";
    endDate = "2024-06-03";

    MockitoAnnotations.openMocks(this);

    account = new GetDepositAccountByIdResponse();
    account.setAccountNumber(accountId);
    account.setCustomerName(customerName);
    account.setAccountTypeDescription("Ahorros");

    depositTx = new Transaction();
    depositTx.setTransactionDate("2024-06-01T10:00:00");
    depositTx.setTransactionTypeId(1L);
    depositTx.setBalance(200.0);
    depositTx.setStatus(true);
    depositTx.setTransactionValue(50.0);

    withdrawalTx = new Transaction();
    withdrawalTx.setTransactionDate("2024-06-02T10:00:00");
    withdrawalTx.setTransactionTypeId(2L);
    withdrawalTx.setBalance(150.0);
    withdrawalTx.setStatus(true);
    withdrawalTx.setTransactionValue(30.0);
  }

  @Test
  void testGenerateReportJsonFormat() {
    when(clientRepositoryAdapter.getDepositAccountByIdCustomer(customerId))
        .thenReturn(ResponseEntity.ok(List.of(account)));
    when(transactionRepositoryPort.findByAccountNumber(accountId))
        .thenReturn(List.of(depositTx, withdrawalTx));

    GetAccountTransactionReportResponse response = service.generateReport(
        customerId, startDate, endDate, formato);

    assertNotNull(response.getTransactions());
    assertEquals(2, response.getTransactions().size());

    TransactionReport report1 = response.getTransactions().get(0);
    assertEquals(customerName, report1.getCustomerName());
    assertEquals(accountId, report1.getAccountNumber());
    assertEquals("Ahorros", report1.getAccountTypeDescription());
    assertEquals(depositTx.getBalance(), report1.getInitialBalance());
    assertEquals(depositTx.getStatus(), report1.getStatus());
    assertEquals(depositTx.getTransactionValue(), report1.getTransactionValue());
    assertEquals(250.0, report1.getAvailableBalance());

    TransactionReport report2 = response.getTransactions().get(1);
    assertEquals(accountId, report2.getAccountNumber());
    assertEquals("Ahorros", report2.getAccountTypeDescription());
    assertEquals(withdrawalTx.getBalance(), report2.getInitialBalance());
    assertEquals(withdrawalTx.getStatus(), report2.getStatus());
    assertEquals(-30.0, report2.getTransactionValue());
    assertEquals(120.0, report2.getAvailableBalance());
  }

  @Test
  void testGenerateReportPdfFormat() {
    when(clientRepositoryAdapter.getDepositAccountByIdCustomer(customerId))
        .thenReturn(ResponseEntity.ok(List.of(account)));
    when(transactionRepositoryPort.findByAccountNumber(accountId))
        .thenReturn(List.of(depositTx));
    when(pdfGenerator.generatePdf(any())).thenReturn("PDF".getBytes());

    GetAccountTransactionReportResponse response = service.generateReport(
        customerId, startDate, endDate, "pdf");

    assertNotNull(response.getPdfReport());
    assertTrue(response.getPdfReport().length() > 0);
    assertTrue(response.getTransactions() == null || response.getTransactions().isEmpty());
  }

  @Test
  void testGenerateReportWithNoAccounts() {
    when(clientRepositoryAdapter.getDepositAccountByIdCustomer(customerId))
        .thenReturn(ResponseEntity.ok(List.of()));

    GetAccountTransactionReportResponse response = service.generateReport(
        customerId, startDate, endDate, formato);

    assertNotNull(response.getTransactions());
    assertTrue(response.getTransactions().isEmpty());
  }

  @Test
  void testGenerateReportFiltersByDate() {
    when(clientRepositoryAdapter.getDepositAccountByIdCustomer(customerId))
        .thenReturn(ResponseEntity.ok(List.of(account)));
    Transaction txOutOfRange = new Transaction();
    txOutOfRange.setTransactionDate("2024-05-01T10:00:00");
    txOutOfRange.setTransactionTypeId(1L);
    txOutOfRange.setBalance(100.0);
    txOutOfRange.setStatus(true);
    txOutOfRange.setTransactionValue(10.0);

    when(transactionRepositoryPort.findByAccountNumber(accountId))
        .thenReturn(List.of(depositTx, txOutOfRange));

    GetAccountTransactionReportResponse response = service.generateReport(
        customerId, startDate, endDate, formato);

    assertEquals(1, response.getTransactions().size());
    assertEquals(startDate, response.getTransactions().get(0).getDate());
  }

}
