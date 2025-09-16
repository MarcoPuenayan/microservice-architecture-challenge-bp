import { TestBed } from '@angular/core/testing';

import { CrudService } from './crud.service';
import { HttpService } from '@pichincha/angular-sdk/http';
import { CreateDtoProducto } from '../types/product.type';
import { environment } from '../../environments/environment';

describe('CrudService', () => {
  let service: CrudService;
  let apiUrl: string = 'products';

  let mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CrudService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    });
    service = TestBed.inject(CrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Get', (done) => {
    mockHttpService.get.mockResolvedValue([]);

    service.getAll().then(() => {
      done();
      expect(mockHttpService.get).toHaveBeenCalledWith(apiUrl);
    });
  });

  it('getById', (done) => {
    mockHttpService.get.mockReturnValue(Promise.resolve({}));

    service.getById(1).then(() => {
      done();
      expect(mockHttpService.get).toHaveBeenCalledWith(`${apiUrl}/1`);
    });
  });

  it('create', (done) => {
    mockHttpService.post.mockResolvedValue({});

    service.create({} as CreateDtoProducto).then(() => {
      done();
      expect(mockHttpService.post).toHaveBeenCalledWith(`${apiUrl}/add`, {});
    });
  });

  it('update', (done) => {
    mockHttpService.put.mockResolvedValue({});

    service.update(1, {} as CreateDtoProducto).then(() => {
      done();
      expect(mockHttpService.put).toHaveBeenCalledWith(`${apiUrl}/1`, {});
    });
  });

  it('delete', (done) => {
    mockHttpService.delete.mockResolvedValue({});

    service.delete(1).then(() => {
      done();
      expect(mockHttpService.delete).toHaveBeenCalledWith(`${apiUrl}/1`);
    });
  });

  it('getAllTransactions', (done) => {
    const mockTransactionResponse = {
      transactions: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    };
    
    mockHttpService.get.mockResolvedValue(mockTransactionResponse);

    service.getAllTransactions(0, 10).then(() => {
      done();
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${environment.depositHost}${environment.transactionPath}/retrieve`,
        { page: 0, limit: 10 },
        expect.objectContaining({
          'x-app': '00738',
          'x-channel': '10',
          'x-medium': '100002'
        })
      );
    });
  });

  it('getAllTransactions with default parameters', (done) => {
    const mockTransactionResponse = {
      transactions: [],
      page: 0,
      size: 10,
      totalElements: 0,
      totalPages: 0
    };
    
    mockHttpService.get.mockResolvedValue(mockTransactionResponse);

    service.getAllTransactions().then(() => {
      done();
      expect(mockHttpService.get).toHaveBeenCalledWith(
        `${environment.depositHost}${environment.transactionPath}/retrieve`,
        { page: 0, limit: 10 },
        expect.objectContaining({
          'x-app': '00738',
          'x-channel': '10',
          'x-medium': '100002'
        })
      );
    });
  });

  describe('URL Construction Tests', () => {
    it('should construct transaction URLs dynamically from environment', () => {
      const expectedUrl = `${environment.depositHost}${environment.transactionPath}/retrieve`;
      expect(expectedUrl).toBe('http://localhost:8098/transactions/domain/current-accounts/v1/account-transactions/retrieve');
    });

    it('should construct deposit account URLs dynamically from environment', () => {
      const expectedUrl = `${environment.depositHost}${environment.depositPath}/retrieve`;
      expect(expectedUrl).toBe('http://localhost:8098/accounts/domain/deposit-account/v1/deposit-accounts/retrieve');
    });

    it('should construct customer URLs dynamically from environment', () => {
      const expectedUrl = `${environment.depositHost}${environment.customerPath}/retrieve`;
      expect(expectedUrl).toBe('http://localhost:8098/customer/domain/customer-profile/v1/customer-profiles/retrieve');
    });
  });
});
