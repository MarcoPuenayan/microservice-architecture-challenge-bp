import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TransactionResolver } from './transaction.resolver';
import { CrudService } from '../services/crud.service';
import { Transaction } from '../interfaces/transaction.interface';

describe('TransactionResolver', () => {
  let resolver: TransactionResolver;
  let crudService: any;

  const mockTransaction: Transaction = {
    transactionId: '123',
    accountNumber: '478755',
    accountDescription: 'Test Account',
    transactionTypeId: 2,
    transactionTypeDescription: 'Retiro',
    transactionValue: 50.00,
    balance: 2000.00,
    transactionDate: '2025-06-01T12:00:00',
    status: true
  };

  beforeEach(() => {
    const crudServiceSpy = jasmine.createSpyObj('CrudService', ['getTransactionById']);

    TestBed.configureTestingModule({
      providers: [
        TransactionResolver,
        { provide: CrudService, useValue: crudServiceSpy }
      ]
    });
    resolver = TestBed.inject(TransactionResolver);
    crudService = TestBed.inject(CrudService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve transaction by id', async () => {
    const route = { params: { id: '123' } } as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    
    crudService.getTransactionById.and.returnValue(Promise.resolve(mockTransaction));

    const result = await resolver.resolve(route, state);

    expect(crudService.getTransactionById).toHaveBeenCalledWith('123');
    expect(result).toEqual(mockTransaction);
  });
});
