import { TestBed } from '@angular/core/testing';
import { CustomerResolver } from './customer.resolver';
import { CrudService } from '../services/crud.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Customer } from '../interfaces/customer.interface';

describe('CustomerResolver', () => {
  let resolver: CustomerResolver;
  let mockCrudService: jest.Mocked<CrudService>;

  const mockCustomer: Customer = {
    customerId: 'test-uuid',
    name: 'Test Customer',
    gender: 'Masculino',
    age: 30,
    identification: '1234567890',
    address: 'Test Address',
    phone: '0987654321',
    status: true
  };

  beforeEach(() => {
    mockCrudService = {
      getCustomerById: jest.fn().mockResolvedValue(mockCustomer),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        CustomerResolver,
        { provide: CrudService, useValue: mockCrudService }
      ]
    });
    resolver = TestBed.inject(CustomerResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve customer by id', async () => {
    const route = { params: { id: 'test-uuid' } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    const result = await resolver.resolve(route, state);

    expect(mockCrudService.getCustomerById).toHaveBeenCalledWith('test-uuid');
    expect(result).toEqual(mockCustomer);
  });
});
