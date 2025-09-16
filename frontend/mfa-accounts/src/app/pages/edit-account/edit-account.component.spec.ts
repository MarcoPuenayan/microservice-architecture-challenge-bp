import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EditAccountComponent } from './edit-account.component';
import { CrudService } from '../../services/crud.service';
import { DepositAccount } from '../../interfaces/deposit-account.interface';
import { Customer } from '../../interfaces/customer.interface';
import { UpdateAccountDto } from '../../types/account.type';

describe('EditAccountComponent', () => {
  let component: EditAccountComponent;
  let fixture: ComponentFixture<EditAccountComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  let mockCrudService = {
    updateAccount: jest.fn(),
    getCustomerById: jest.fn(),
  };

  const accountMock: DepositAccount = {
    accountId: 'account-123',
    accountNumber: '478755',
    accountTypeId: 1,
    accountTypeDescription: 'Ahorro',
    initialBalance: 2500,
    customerId: 'cf8804e7-cfbc-48be-90ab-e077932576b2',
    customerName: 'John Doe',
    status: true
  };

  const customerMock: Customer = {
    customerId: 'cf8804e7-cfbc-48be-90ab-e077932576b2',
    name: 'John Doe',
    gender: 'Masculino',
    age: 30,
    identification: '1234567890',
    address: 'Norte',
    phone: '123456789',
    status: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAccountComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: CrudService, useValue: mockCrudService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                account: accountMock
              }
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAccountComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
  });

  beforeEach(() => {
    mockCrudService.getCustomerById.mockResolvedValue(customerMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with correct controls', () => {
    expect(component.editForm.get('accountNumber')).toBeTruthy();
    expect(component.editForm.get('accountTypeId')).toBeTruthy();
    expect(component.editForm.get('initialBalance')).toBeTruthy();
    expect(component.editForm.get('customerId')).toBeTruthy();
    expect(component.editForm.get('customerName')).toBeTruthy();
    expect(component.editForm.get('status')).toBeTruthy();
  });

  it('should load account data on initialization', async () => {
    await component.loadAccountData();
    expect(component.account).toEqual(accountMock);
  });

  it('should load customer data', async () => {
    await component.loadCustomerData(customerMock.customerId);
    expect(mockCrudService.getCustomerById).toHaveBeenCalledWith(customerMock.customerId);
    expect(component.customer).toEqual(customerMock);
  });

  it('should populate form with account data', () => {
    component.account = accountMock;
    component.customer = customerMock;
    component.populateForm();

    expect(component.editForm.get('accountNumber')?.value).toBe(accountMock.accountNumber);
    expect(component.editForm.get('accountTypeId')?.value).toBe(accountMock.accountTypeId);
    expect(component.editForm.get('initialBalance')?.value).toBe(accountMock.initialBalance);
    expect(component.editForm.get('customerId')?.value).toBe(accountMock.customerId);
    expect(component.editForm.get('customerName')?.value).toBe(customerMock.name);
    expect(component.editForm.get('status')?.value).toBe(accountMock.status);
  });

  it('should have read-only fields disabled', () => {
    expect(component.editForm.get('accountNumber')?.disabled).toBeTruthy();
    expect(component.editForm.get('accountTypeId')?.disabled).toBeTruthy();
    expect(component.editForm.get('customerId')?.disabled).toBeTruthy();
    expect(component.editForm.get('customerName')?.disabled).toBeTruthy();
  });

  it('should have editable fields enabled', () => {
    expect(component.editForm.get('initialBalance')?.disabled).toBeFalsy();
    expect(component.editForm.get('status')?.disabled).toBeFalsy();
  });

  it('should validate required fields', () => {
    component.editForm.patchValue({
      initialBalance: null,
      status: null
    });

    expect(component.editForm.get('initialBalance')?.hasError('required')).toBeTruthy();
    expect(component.editForm.get('status')?.hasError('required')).toBeTruthy();
  });

  it('should validate initial balance minimum value', () => {
    component.editForm.patchValue({
      initialBalance: -100
    });

    expect(component.editForm.get('initialBalance')?.hasError('min')).toBeTruthy();
  });

  it('should submit form successfully', async () => {
    component.account = accountMock;
    mockCrudService.updateAccount.mockResolvedValue({});

    component.editForm.patchValue({
      initialBalance: 3000,
      status: false
    });

    await component.onSubmit();

    const expectedUpdateDto: UpdateAccountDto = {
      accountNumber: accountMock.accountNumber,
      accountTypeId: accountMock.accountTypeId,
      initialBalance: 3000,
      customerId: accountMock.customerId,
      status: false
    };

    expect(mockCrudService.updateAccount).toHaveBeenCalledWith(accountMock.accountId, expectedUpdateDto);
    expect(component.successMessage).toBe('Cuenta editada correctamente');
    expect(component.errorMessage).toBe('');
  });

  it('should handle 404 error when account not found', async () => {
    component.account = accountMock;
    mockCrudService.updateAccount.mockRejectedValue({ status: 404 });

    component.editForm.patchValue({
      initialBalance: 3000,
      status: false
    });

    await component.onSubmit();

    expect(component.errorMessage).toBe('La cuenta a editar no existe');
    expect(component.successMessage).toBe('');
  });

  it('should handle generic error', async () => {
    component.account = accountMock;
    mockCrudService.updateAccount.mockRejectedValue({ error: { message: 'Custom error' } });

    component.editForm.patchValue({
      initialBalance: 3000,
      status: false
    });

    await component.onSubmit();

    expect(component.errorMessage).toBe('Custom error');
    expect(component.successMessage).toBe('');
  });

  it('should not submit invalid form', async () => {
    component.editForm.patchValue({
      initialBalance: null,
      status: null
    });

    await component.onSubmit();

    expect(mockCrudService.updateAccount).not.toHaveBeenCalled();
  });

  it('should navigate to list page on reset', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.resetForm();
    expect(navigateSpy).toHaveBeenCalledWith(['../list'], { relativeTo: activatedRoute });
  });

  it('should get account type description', () => {
    expect(component.getAccountTypeDescription(1)).toBe('Ahorro');
    expect(component.getAccountTypeDescription(2)).toBe('Corriente');
    expect(component.getAccountTypeDescription(999)).toBe('Desconocido');
  });

  it('should handle customer loading error', async () => {
    mockCrudService.getCustomerById.mockRejectedValue(new Error('Customer not found'));
    
    await component.loadCustomerData('invalid-id');
    
    expect(component.customer).toBeNull();
  });
});
