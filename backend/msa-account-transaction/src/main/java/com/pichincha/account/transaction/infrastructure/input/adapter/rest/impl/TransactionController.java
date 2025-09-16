package com.pichincha.account.transaction.infrastructure.input.adapter.rest.impl;

import static com.pichincha.account.transaction.domain.utils.Constants.X_AGENCY;
import static com.pichincha.account.transaction.domain.utils.Constants.X_DEVICE;
import static com.pichincha.account.transaction.domain.utils.Constants.X_GEOLOCATION;
import static com.pichincha.common.constant.HeaderConstants.X_APP;
import static com.pichincha.common.constant.HeaderConstants.X_CHANNEL;
import static com.pichincha.common.constant.HeaderConstants.X_DEVICE_IP;
import static com.pichincha.common.constant.HeaderConstants.X_GUID;
import static com.pichincha.common.constant.HeaderConstants.X_MEDIUM;
import static com.pichincha.common.constant.HeaderConstants.X_SESSION;
import static lombok.AccessLevel.PRIVATE;

import com.pichincha.account.transaction.application.input.port.CreateTransactionUseCase;
import com.pichincha.account.transaction.application.input.port.DeleteTransactionByIdUseCase;
import com.pichincha.account.transaction.application.input.port.FindAllTransactionsUseCase;
import com.pichincha.account.transaction.application.input.port.FindReportTransactionsUseCase;
import com.pichincha.account.transaction.application.input.port.FindTransactionByIdUseCase;
import com.pichincha.account.transaction.application.input.port.UpdateTransactionUseCase;
import com.pichincha.account.transaction.domain.model.Transaction;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.DomainApi;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.mapper.TransactionRestMapper;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionByIdResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionReportResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.GetAccountTransactionResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.PostAccountTransactionRequest;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.PostAccountTransactionResponse;
import com.pichincha.account.transaction.infrastructure.input.adapter.rest.models.PutAccountTransactionRequest;
import com.pichincha.common.domain.EventType;
import com.pichincha.common.domain.LoggerAttributes;
import com.pichincha.common.domain.Strategy;
import com.pichincha.common.service.LoggerAuditorService;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class TransactionController implements DomainApi {

  private final CreateTransactionUseCase createTransactionUseCase;
  private final FindAllTransactionsUseCase findAllTransactionsUseCase;
  private final FindTransactionByIdUseCase findTransactionByIdUseCase;
  private final UpdateTransactionUseCase updateTransactionUseCase;
  private final DeleteTransactionByIdUseCase deleteTransactionByIdUseCase;
  private final FindReportTransactionsUseCase findReportTransactionsUseCase;
  private final TransactionRestMapper transactionRestMapper;
  public final LoggerAuditorService loggerAuditor;

  private static Map<String, String> getHeadersMap(String xApp, String xGuid, String xChannel,
      String xMedium, String xSession, String xDevice, String xDeviceIp, String xAgency,
      String xGeolocation) {
    Map<String, String> headers = new HashMap<>();
    headers.put(X_APP, xApp);
    headers.put(X_GUID, xGuid);
    headers.put(X_CHANNEL, xChannel);
    headers.put(X_MEDIUM, xMedium);
    headers.put(X_SESSION, xSession);
    headers.put(X_DEVICE, xDevice);
    headers.put(X_DEVICE_IP, xDeviceIp);
    headers.put(X_AGENCY, xAgency);
    headers.put(X_GEOLOCATION, xGeolocation);
    return headers;
  }

  @Override
  @PostMapping
  public ResponseEntity<PostAccountTransactionResponse> postAccountTransaction(
      @RequestHeader(X_APP) String xApp,
      @RequestHeader(X_GUID) String xGuid,
      @RequestHeader(X_CHANNEL) String xChannel,
      @RequestHeader(X_MEDIUM) String xMedium,
      @RequestHeader(X_SESSION) String xSession,
      @RequestHeader(X_DEVICE) String xDevice,
      @RequestHeader(X_DEVICE_IP) String xDeviceIp,
      @RequestHeader(X_AGENCY) String xAgency,
      @RequestHeader(X_GEOLOCATION) String xGeolocation,
      @RequestBody PostAccountTransactionRequest request
  ) {
    Transaction transaction = transactionRestMapper.toDomain(request);
    Transaction createdTransaction = createTransactionUseCase.createTransaction(transaction);
    PostAccountTransactionResponse response = transactionRestMapper.toResponse(createdTransaction);
    loggerAuditor(request, HttpStatus.CREATED, "postAccountTransaction");
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @Override
  @GetMapping
  public ResponseEntity<GetAccountTransactionResponse> getAccountTransaction(
      @RequestHeader(X_APP) String xApp,
      @RequestHeader(X_GUID) String xGuid,
      @RequestHeader(X_CHANNEL) String xChannel,
      @RequestHeader(X_MEDIUM) String xMedium,
      @RequestHeader(X_SESSION) String xSession,
      @RequestHeader(X_DEVICE) String xDevice,
      @RequestHeader(X_DEVICE_IP) String xDeviceIp,
      @RequestHeader(X_AGENCY) String xAgency,
      @RequestHeader(X_GEOLOCATION) String xGeolocation,
      @RequestParam(required = false) Integer page,
      @RequestParam(required = false) Integer limit
  ) {
    Pageable pageable = (page == null || limit == null) ? Pageable.unpaged() : PageRequest.of(page, limit);
    Page<Transaction> transactionPage = findAllTransactionsUseCase.findAllTransactions(pageable);

    if (transactionPage.getContent().isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    GetAccountTransactionResponse response = transactionRestMapper.toGetAccountTransactionResponse(
        transactionPage.getContent(),
        transactionPage.getNumber(),
        transactionPage.getSize(),
        transactionPage.getTotalElements(),
        transactionPage.getTotalPages()
    );
    loggerAuditor(response.getTransactions(), HttpStatus.OK, "getAccountTransaction");
    return ResponseEntity.ok(response);
  }

  @Override
  @GetMapping("/{transactionId}")
  public ResponseEntity<GetAccountTransactionByIdResponse> getAccountTransactionById(
      @RequestHeader(X_APP) String xApp,
      @RequestHeader(X_GUID) String xGuid,
      @RequestHeader(X_CHANNEL) String xChannel,
      @RequestHeader(X_MEDIUM) String xMedium,
      @RequestHeader(X_SESSION) String xSession,
      @RequestHeader(X_DEVICE) String xDevice,
      @RequestHeader(X_DEVICE_IP) String xDeviceIp,
      @PathVariable String transactionId,
      @RequestHeader(X_AGENCY) String xAgency,
      @RequestHeader(X_GEOLOCATION) String xGeolocation
  ) {
    Transaction account = findTransactionByIdUseCase.findTransactionById(transactionId);
    loggerAuditor(account, HttpStatus.OK, "getAccountTransactionById");
    return ResponseEntity.ok(transactionRestMapper.toGetAccountTransactionByIdResponse(account));
  }

  @Override
  @PutMapping("/{transactionId}")
  public ResponseEntity<Void> putAccountTransaction(
      @RequestHeader(X_APP) String xApp,
      @RequestHeader(X_GUID) String xGuid,
      @RequestHeader(X_CHANNEL) String xChannel,
      @RequestHeader(X_MEDIUM) String xMedium,
      @RequestHeader(X_SESSION) String xSession,
      @RequestHeader(X_DEVICE) String xDevice,
      @RequestHeader(X_DEVICE_IP) String xDeviceIp,
      @PathVariable String transactionId,
      @RequestHeader(X_AGENCY) String xAgency,
      @RequestHeader(X_GEOLOCATION) String xGeolocation,
      @RequestBody PutAccountTransactionRequest request
  ) {
    Transaction transaction = transactionRestMapper.toTransaction(request);
    updateTransactionUseCase.updateTransaction(transactionId, transaction);
    loggerAuditor(request, HttpStatus.NO_CONTENT, "putAccountTransaction");
    return ResponseEntity.noContent().build();
  }

  @Override
  @DeleteMapping("/{transactionId}")
  public ResponseEntity<Void> deleteAccountTransaction(
      @RequestHeader(X_APP) String xApp,
      @RequestHeader(X_GUID) String xGuid,
      @RequestHeader(X_CHANNEL) String xChannel,
      @RequestHeader(X_MEDIUM) String xMedium,
      @RequestHeader(X_SESSION) String xSession,
      @RequestHeader(X_DEVICE) String xDevice,
      @RequestHeader(X_DEVICE_IP) String xDeviceIp,
      @PathVariable String transactionId,
      @RequestHeader(X_AGENCY) String xAgency,
      @RequestHeader(X_GEOLOCATION) String xGeolocation
  ) {
    deleteTransactionByIdUseCase.deleteTransactionById(transactionId);
    return ResponseEntity.noContent().build();
  }

  @Override
  @GetMapping("/report-retrieve")
  public ResponseEntity<GetAccountTransactionReportResponse> getAccountTransactionReport(
      @RequestHeader(X_APP) String xApp,
      @RequestHeader(X_GUID) String xGuid,
      @RequestHeader(X_CHANNEL) String xChannel,
      @RequestHeader(X_MEDIUM) String xMedium,
      @RequestHeader(X_SESSION) String xSession,
      @RequestHeader(X_DEVICE) String xDevice,
      @RequestHeader(X_DEVICE_IP) String xDeviceIp,
      @RequestParam String customerId,
      @RequestParam String startDate,
      @RequestParam String endDate,
      @RequestHeader(X_AGENCY) String xAgency,
      @RequestHeader(X_GEOLOCATION) String xGeolocation,
      @RequestParam(defaultValue = "json") String format
  ) {
    GetAccountTransactionReportResponse result = findReportTransactionsUseCase.generateReport(
        customerId, startDate, endDate, format);
    return ResponseEntity.ok(result);
  }

  public void loggerAuditor(Object personDto, HttpStatus httpStatus,
      String nameMethod) {
    SecureRandom secureRandomString = new SecureRandom();
    int idTransactionalString = secureRandomString.nextInt();
    loggerAuditor.log(LoggerAttributes.builder().type(EventType.REQUEST)
        .object(personDto)
        .transactionId(String.valueOf(idTransactionalString))
        .component(nameMethod + idTransactionalString)
        .mode(Strategy.EXTERNAL)
        .statusCode(httpStatus.value())
        .build());
  }
}
