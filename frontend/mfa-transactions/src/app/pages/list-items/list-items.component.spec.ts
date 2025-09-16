import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsComponent } from './list-items.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../../services/crud.service';
import { Router } from '@angular/router';
import { Transaction, TransactionResponse } from '../../interfaces/transaction.interface';

describe('ListItemsComponent', () => {
  let component: ListItemsComponent;
  let fixture: ComponentFixture<ListItemsComponent>;
  let router: Router;
  let mockCrudService: jest.Mocked<CrudService>;

  const mockTransactionResponse: TransactionResponse = {
    transactions: [
      {
        transactionId: 'ce88de1b-b1f6-4dce-9e7d-3e094dbf8e50',
        accountNumber: '478755',
        accountDescription: 'Cuenta Corriente',
        transactionTypeId: 1,
        transactionTypeDescription: 'Deposito',
        transactionValue: 20.0,
        balance: 1980.0,
        transactionDate: '2025-06-22T12:00:00',
        status: true
      }
    ],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
  };

  beforeEach(async () => {
    mockCrudService = {
      getAllTransactions: jest.fn().mockResolvedValue(mockTransactionResponse),
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ListItemsComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: CrudService, useValue: mockCrudService }],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load transactions on init', () => {
    expect(mockCrudService.getAllTransactions).toHaveBeenCalled();
    expect(component.itemss).toHaveLength(1);
  });

  it('should map transaction data correctly', () => {
    const transaction: Transaction = {
      transactionId: 'test-id',
      accountNumber: '123456',
      accountDescription: 'Test Account',
      transactionTypeId: 1,
      transactionTypeDescription: 'Deposito',
      transactionValue: 100.0,
      balance: 500.0,
      transactionDate: '2025-06-22T12:00:00',
      status: true
    };

    const result = component.mapTransactionRowData(transaction);

    expect(result.id).toBe('test-id');
    expect(result.columns[0].primaryText).toBe('123456');
    expect(result.columns[1].primaryText).toBe('Test Account');
    expect(result.columns[2].primaryText).toBe('500');
    expect(result.columns[3].primaryText).toBe('Activo');
    expect(result.columns[4].primaryText).toBe('Deposito de 100');
  });

  it('should handle null account description', () => {
    const transaction: Transaction = {
      transactionId: 'test-id',
      accountNumber: '123456',
      accountDescription: null,
      transactionTypeId: 1,
      transactionTypeDescription: 'Deposito',
      transactionValue: 100.0,
      balance: 500.0,
      transactionDate: '2025-06-22T12:00:00',
      status: false
    };

    const result = component.mapTransactionRowData(transaction);

    expect(result.columns[1].primaryText).toBe('N/A');
    expect(result.columns[3].primaryText).toBe('Inactivo');
  });
});
