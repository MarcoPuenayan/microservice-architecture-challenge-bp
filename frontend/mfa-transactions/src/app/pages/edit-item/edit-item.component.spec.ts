import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemComponent } from './edit-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Account, AccountResponse, CreateTransactionDto } from 'src/app/interfaces/account.interface';
import { Transaction, UpdateTransactionDto, AccountInfo } from 'src/app/interfaces/transaction.interface';
import { PichinchaReactiveControlsModule } from '@pichincha/ds-angular';
import { of } from 'rxjs';

describe('EditItemComponent', () => {
  let component: EditItemComponent;
  let fixture: ComponentFixture<EditItemComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  const mockAccountsResponse: AccountResponse = {
    accounts: [
      {
        accountNumber: '478755',
        accountDescription: 'Cuenta de Ahorros',
        accountTypeId: 1,
        accountTypeDescription: 'Ahorros',
        balance: 1000,
        status: true
      },
      {
        accountNumber: '478756',
        accountDescription: 'Cuenta Corriente',
        accountTypeId: 2,
        accountTypeDescription: 'Corriente',
        balance: 2000,
        status: true
      }
    ],
    page: 0,
    size: 2,
    totalElements: 2,
    totalPages: 1
  };

  const mockTransaction: Transaction = {
    transactionId: '123',
    accountNumber: '478755',
    accountDescription: 'Cuenta de Ahorros',
    transactionTypeId: 2,
    transactionTypeDescription: 'Retiro',
    transactionValue: 50.00,
    balance: 2000.00,
    transactionDate: '2025-06-01T12:00:00',
    status: true
  };

  const mockAccountInfo: AccountInfo = {
    accountNumber: '478755',
    accountDescription: 'Cuenta de Ahorros'
  };

  let mockCrudService = {
    getAllAccounts: jest.fn().mockResolvedValue(mockAccountsResponse),
    createTransaction: jest.fn().mockResolvedValue({}),
    updateTransaction: jest.fn().mockResolvedValue({}),
    getAccountInfo: jest.fn().mockResolvedValue(mockAccountInfo),
  };

  let mockActivatedRoute = {
    snapshot: {
      params: {},
      data: {}
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditItemComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        PichinchaReactiveControlsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CrudService, useValue: mockCrudService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    // Reset mocks before each test
    mockActivatedRoute.snapshot.params = {};
    mockActivatedRoute.snapshot.data = {};
    
    fixture = TestBed.createComponent(EditItemComponent);
    component = fixture.componentInstance;
    // Don't call detectChanges here since ngOnInit needs to run first
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Create mode', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await component.ngOnInit();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
      expect(component.isEditMode).toBe(false);
    });

    it('should load accounts on init in create mode', async () => {
      await component.ngOnInit();
      
      expect(mockCrudService.getAllAccounts).toHaveBeenCalled();
      expect(component.accounts).toEqual(mockAccountsResponse.accounts);
      expect(component.filteredAccounts).toEqual(mockAccountsResponse.accounts);
    });

    it('should create transaction successfully', async () => {
      const navigateMock = jest.spyOn(router, 'navigate').mockResolvedValue(true);
      
      component.registerForm.patchValue({
        accountNumber: '478755',
        transactionTypeId: 1,
        transactionValue: 50.00,
        transactionDate: '2025-06-22T12:00:00'
      });

      await component.onSubmit();

      expect(mockCrudService.createTransaction).toHaveBeenCalledWith({
        accountNumber: '478755',
        transactionTypeId: 1,
        transactionValue: 50.00,
        transactionDate: '2025-06-22T12:00:00'
      });
      expect(component.showSuccessModal).toBe(true);
    });

    it('should not create transaction when form is invalid', async () => {
      await component.onSubmit();

      expect(mockCrudService.createTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Edit mode', () => {
    beforeEach(async () => {
      mockActivatedRoute.snapshot.params = { id: '123' };
      mockActivatedRoute.snapshot.data = { transaction: mockTransaction };
      fixture.detectChanges();
      await component.ngOnInit();
    });

    it('should initialize in edit mode', () => {
      expect(component.isEditMode).toBe(true);
      expect(component.transactionId).toBe('123');
    });

    it('should load transaction data and account info on init', async () => {
      await component.ngOnInit();
      
      expect(mockCrudService.getAccountInfo).toHaveBeenCalledWith('478755');
      expect(component.currentTransaction).toEqual(mockTransaction);
      expect(component.accountInfo).toEqual(mockAccountInfo);
    });

    it('should update transaction successfully', async () => {
      component.currentTransaction = mockTransaction;
      component.registerForm.patchValue({
        balance: 2500.00,
        status: false
      });

      await component.onSubmit();

      expect(mockCrudService.updateTransaction).toHaveBeenCalledWith('123', {
        accountNumber: '478755',
        transactionTypeId: '2',
        transactionValue: '50',
        balance: '2500',
        transactionDate: '2025-06-01T12:00:00',
        status: false
      });
      expect(component.showSuccessModal).toBe(true);
    });

    it('should not allow editing of disabled fields', () => {
      const accountNumberControl = component.registerForm.get('accountNumber');
      const typeControl = component.registerForm.get('transactionTypeId');
      const valueControl = component.registerForm.get('transactionValue');
      const dateControl = component.registerForm.get('transactionDate');
      const balanceControl = component.registerForm.get('balance');
      const statusControl = component.registerForm.get('status');

      expect(accountNumberControl?.disabled).toBe(true);
      expect(typeControl?.disabled).toBe(true);
      expect(valueControl?.disabled).toBe(true);
      expect(dateControl?.disabled).toBe(true);
      expect(balanceControl?.disabled).toBe(false); // Should be editable
      expect(statusControl?.disabled).toBe(false); // Should be editable
    });
  });

  it('should filter accounts based on search term', () => {
    component.accounts = mockAccountsResponse.accounts;
    component.filteredAccounts = mockAccountsResponse.accounts;
    
    component.onAccountSearch('478755');
    
    expect(component.filteredAccounts).toHaveLength(1);
    expect(component.filteredAccounts[0].accountNumber).toBe('478755');
  });

  it('should handle error response correctly', async () => {
    const errorResponse = {
      status: 409,
      error: { message: 'La transacción a editar no existe' }
    };
    
    mockCrudService.createTransaction.mockRejectedValue(errorResponse);
    
    component.registerForm.patchValue({
      accountNumber: '478755',
      transactionTypeId: 1,
      transactionValue: 50.00,
      transactionDate: '2025-06-22T12:00:00'
    });

    await component.onSubmit();

    expect(component.errorMessage).toBe('La transacción a editar no existe');
  });

  it('should navigate to list page on success modal close', () => {
    const navigateMock = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    
    component.onSuccessModalClose();

    expect(component.showSuccessModal).toBe(false);
    expect(navigateMock).toHaveBeenCalledWith(['../list'], { relativeTo: expect.any(Object) });
  });

  it('should reset form and navigate', () => {
    const navigateMock = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.resetForm();

    expect(navigateMock).toHaveBeenCalledWith(['../list'], { relativeTo: expect.any(Object) });
  });
});
