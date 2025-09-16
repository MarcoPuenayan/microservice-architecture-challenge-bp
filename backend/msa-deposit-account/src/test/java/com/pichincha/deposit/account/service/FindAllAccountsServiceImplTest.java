package com.pichincha.deposit.account.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.pichincha.customer.client.api.DomainApiClient;
import com.pichincha.customer.client.models.PostCustomerProfilesResponse;
import com.pichincha.deposit.account.application.output.port.AccountRepositoryPort;
import com.pichincha.deposit.account.application.service.FindAllAccountsServiceImpl;
import com.pichincha.deposit.account.domain.model.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;

import java.util.*;

public class FindAllAccountsServiceImplTest {

  @Mock
  private AccountRepositoryPort accountRepositoryPort;
  @Mock
  private DomainApiClient customerApiClient;

  @InjectMocks
  private FindAllAccountsServiceImpl service;

  Account account;
  Page<Account> accountsPage;
  private Pageable pageable;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    pageable = PageRequest.of(0, 10);

    account = new Account();
    account.setCustomerId("1");
    accountsPage = new PageImpl<>(List.of(account));
  }

  @Test
  void testFindAllAccountsSuccess() {
    Account account1 = new Account();
    account1.setCustomerId("1");
    Account account2 = new Account();
    account2.setCustomerId("2");
    List<Account> accounts = Arrays.asList(account1, account2);
    Page<Account> accountsPage = new PageImpl<>(accounts);

    PostCustomerProfilesResponse resp1 = new PostCustomerProfilesResponse();
    resp1.setCustomerId("1");
    resp1.setName("Cliente Uno");
    PostCustomerProfilesResponse resp2 = new PostCustomerProfilesResponse();
    resp2.setCustomerId("2");
    resp2.setName("Cliente Dos");
    List<PostCustomerProfilesResponse> customerResponses = Arrays.asList(resp1, resp2);

    when(accountRepositoryPort.findAllAccounts(pageable)).thenReturn(accountsPage);
    when(customerApiClient.postCustomerProfilesBatch(anyList()))
        .thenReturn(ResponseEntity.ok(customerResponses));

    Page<Account> result = service.findAllAccounts(pageable);

    assertEquals("Cliente Uno", result.getContent().get(0).getCustomerName());
    assertEquals("Cliente Dos", result.getContent().get(1).getCustomerName());
  }

  @Test
  void testFindAllAccountsEmptyPage() {
    Page<Account> emptyPage = new PageImpl<>(Collections.emptyList());
    when(accountRepositoryPort.findAllAccounts(pageable)).thenReturn(emptyPage);

    Page<Account> result = service.findAllAccounts(pageable);

    assertTrue(result.isEmpty());
    verify(customerApiClient, never()).postCustomerProfilesBatch(anyList());
  }

  @Test
  void testFindAllAccountsCustomerResponseNull() {
    when(accountRepositoryPort.findAllAccounts(pageable)).thenReturn(accountsPage);
    when(customerApiClient.postCustomerProfilesBatch(anyList()))
        .thenReturn(ResponseEntity.ok(null));

    assertThrows(AssertionError.class, () -> service.findAllAccounts(pageable));
  }

  @Test
  void testFindAllAccountsCustomerResponseEmpty() {
    when(accountRepositoryPort.findAllAccounts(pageable)).thenReturn(accountsPage);
    when(customerApiClient.postCustomerProfilesBatch(anyList()))
        .thenReturn(ResponseEntity.ok(Collections.emptyList()));

    Page<Account> result = service.findAllAccounts(pageable);

    assertNull(result.getContent().get(0).getCustomerName());
  }

}
