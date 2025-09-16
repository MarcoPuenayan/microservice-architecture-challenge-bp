import { TestBed } from '@angular/core/testing';

import { CrudService } from './crud.service';
import { AuthHttpService } from './auth-http.service';
import { CreateDtoProducto } from '../types/product.type';
import { CreateAccountDto } from '../types/account.type';
import { ResponseDepositAccounts } from '../interfaces/deposit-account.interface';
import { ResponseCustomer } from '../interfaces/customer.interface';
import { environment } from '../../environments/environment';

describe('CrudService', () => {
  let service: CrudService;
  let apiUrl: string = 'products';
  let depositAccountsUrl: string = `${environment.depositHost}${environment.depositPath}/retrieve`;
  let customersUrl: string = `${environment.depositHost}${environment.customerPath}/retrieve`;
  let createAccountUrl: string = `${environment.depositHost}${environment.depositPath}/register`;

  let mockAuthHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrudService,
        { provide: AuthHttpService, useValue: mockAuthHttpService },
      ],
    });
    service = TestBed.inject(CrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build URLs dynamically from environment', () => {
    expect(depositAccountsUrl).toBe(`${environment.depositHost}${environment.depositPath}/retrieve`);
    expect(customersUrl).toBe(`${environment.depositHost}${environment.customerPath}/retrieve`);
    expect(createAccountUrl).toBe(`${environment.depositHost}${environment.depositPath}/register`);
  });

  it('Get', (done) => {
    mockAuthHttpService.get.mockResolvedValue([]);

    service.getAll().then(() => {
      done();
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(apiUrl);
    });
  });

  it('getById', (done) => {
    mockAuthHttpService.get.mockReturnValue(Promise.resolve({}));

    service.getById(1).then(() => {
      done();
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${apiUrl}/1`);
    });
  });

  it('create', (done) => {
    mockAuthHttpService.post.mockResolvedValue({});

    service.create({} as CreateDtoProducto).then(() => {
      done();
      expect(mockAuthHttpService.post).toHaveBeenCalledWith(`${apiUrl}/add`, {});
    });
  });

  it('update', (done) => {
    mockAuthHttpService.put.mockResolvedValue({});

    service.update(1, {} as CreateDtoProducto).then(() => {
      done();
      expect(mockAuthHttpService.put).toHaveBeenCalledWith(`${apiUrl}/1`, {});
    });
  });

  it('delete', (done) => {
    mockAuthHttpService.delete.mockResolvedValue({});

    service.delete(1).then(() => {
      done();
      expect(mockAuthHttpService.delete).toHaveBeenCalledWith(`${apiUrl}/1`);
    });
  });

  it('getAllDepositAccounts with default parameters', (done) => {
    const mockResponse: ResponseDepositAccounts = {
      accounts: [],
      page: 0,
      size: 5,
      totalElements: 0,
      totalPages: 0
    };
    
    mockAuthHttpService.get.mockResolvedValue(mockResponse);

    service.getAllDepositAccounts().then((response) => {
      done();
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${depositAccountsUrl}?page=0&limit=5`);
      expect(response).toBe(mockResponse);
    });
  });

  it('getAllDepositAccounts with custom parameters', (done) => {
    const mockResponse: ResponseDepositAccounts = {
      accounts: [],
      page: 2,
      size: 10,
      totalElements: 25,
      totalPages: 3
    };
    
    mockAuthHttpService.get.mockResolvedValue(mockResponse);

    service.getAllDepositAccounts(2, 10).then((response) => {
      done();
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${depositAccountsUrl}?page=2&limit=10`);
      expect(response).toBe(mockResponse);
    });
  });

  it('getAllCustomers', (done) => {
    const mockResponse: ResponseCustomer = {
      customer: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    };
    mockAuthHttpService.get.mockResolvedValue(mockResponse);

    service.getAllCustomers().then(() => {
      done();
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${customersUrl}?page=0&limit=100`);
    });
  });

  it('createAccount', (done) => {
    const mockAccount: CreateAccountDto = {
      accountNumber: '123456',
      accountTypeId: 1,
      initialBalance: 1000,
      customerId: 'test-customer-id'
    };
    mockAuthHttpService.post.mockResolvedValue({});

    service.createAccount(mockAccount).then(() => {
      done();
      expect(mockAuthHttpService.post).toHaveBeenCalledWith(createAccountUrl, mockAccount);
    });
  });
});
