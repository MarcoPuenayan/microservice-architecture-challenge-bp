import { TestBed } from '@angular/core/testing';

import { CrudService } from './crud.service';
import { AuthHttpService } from './auth-http.service';
import { CreateDtoProducto } from '../types/product.type';
import { CustomerResponse } from '../interfaces/customer.interface';
import { environment } from '../../environments/environment';

describe('CrudService', () => {
  let service: CrudService;
  let apiUrl: string = 'products';
  let customerApiUrl: string = `${environment.customer.host}${environment.customer.path}/retrieve`;

  let mockAuthHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  const mockCustomerResponse: CustomerResponse = {
    customer: [
      {
        customerId: 'test-uuid',
        name: 'Test Customer',
        gender: 'Masculino',
        age: 30,
        identification: '1234567890',
        address: 'Test Address',
        phone: '0987654321',
        status: true
      }
    ],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
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

  it('getAllCustomers - should call correct endpoint with default pagination', (done) => {
    mockAuthHttpService.get.mockResolvedValue(mockCustomerResponse);

    service.getAllCustomers().then((response) => {
      expect(response).toEqual(mockCustomerResponse);
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${customerApiUrl}?page=0&limit=10`);
      done();
    });
  });

  it('getAllCustomers - should call correct endpoint with custom pagination', (done) => {
    mockAuthHttpService.get.mockResolvedValue(mockCustomerResponse);

    service.getAllCustomers(2, 5).then((response) => {
      expect(response).toEqual(mockCustomerResponse);
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${customerApiUrl}?page=2&limit=5`);
      done();
    });
  });

  it('createCustomer - should call correct endpoint with customer data', (done) => {
    const customerData = {
      name: 'New Customer',
      gender: 'Masculino',
      identification: '1234567890',
      age: 25,
      address: 'New Address',
      phone: '0987654321',
      password: 'testpassword'
    };
    mockAuthHttpService.post.mockResolvedValue({});

    service.createCustomer(customerData).then(() => {
      expect(mockAuthHttpService.post).toHaveBeenCalledWith(`${environment.customer.host}${environment.customer.path}/register`, customerData);
      done();
    });
  });

  it('deleteCustomer - should call correct endpoint with customer id', (done) => {
    const customerId = 'test-uuid';
    mockAuthHttpService.delete.mockResolvedValue({});

    service.deleteCustomer(customerId).then(() => {
      expect(mockAuthHttpService.delete).toHaveBeenCalledWith(`${environment.customer.host}${environment.customer.path}/${customerId}/delete`);
      done();
    });
  });

  it('updateCustomer - should call correct endpoint with customer id and data', (done) => {
    const customerId = 'test-uuid';
    const customerData = {
      name: 'Updated Name',
      gender: 'Femenino',
      identification: '0979847154',
      age: 29,
      address: 'Sur',
      phone: '0956298467',
      status: true
    };
    mockAuthHttpService.put.mockResolvedValue({});

    service.updateCustomer(customerId, customerData).then(() => {
      expect(mockAuthHttpService.put).toHaveBeenCalledWith(`${environment.customer.host}${environment.customer.path}/${customerId}/update`, customerData);
      done();
    });
  });

  it('getCustomerById - should call correct endpoint with customer id', (done) => {
    const customerId = 'test-uuid';
    const mockCustomer = {
      customerId: 'test-uuid',
      name: 'Test Customer',
      gender: 'Masculino',
      age: 30,
      identification: '1234567890',
      address: 'Test Address',
      phone: '0987654321',
      status: true
    };
    mockAuthHttpService.get.mockResolvedValue(mockCustomer);

    service.getCustomerById(customerId).then((response) => {
      expect(response).toEqual(mockCustomer);
      expect(mockAuthHttpService.get).toHaveBeenCalledWith(`${environment.customer.host}${environment.customer.path}/${customerId}/retrieve`);
      done();
    });
  });
});
