import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EditItemComponent } from './edit-item.component';
import { CrudService } from '../../services/crud.service';
import { CreateAccountDto } from '../../types/account.type';
import { Customer } from '../../interfaces/customer.interface';

describe('EditItemComponent', () => {
  let component: EditItemComponent;
  let fixture: ComponentFixture<EditItemComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  let mockCrudService = {
    createAccount: jest.fn(),
    getAllCustomers: jest.fn(),
  };

  const customersMock: Customer[] = [
    {
      customerId: 'cf8804e7-cfbc-48be-90ab-e077932576b2',
      name: 'John Doe',
      gender: 'Masculino',
      age: 30,
      identification: '1234567890',
      address: 'Norte',
      phone: '123456789',
      status: true
    },
    {
      customerId: 'cf8804e7-cfbc-48be-90ab-e077932576b3',
      name: 'Jane Smith',
      gender: 'Femenino',
      age: 25,
      identification: '0987654321',
      address: 'Sur',
      phone: '987654321',
      status: true
    }
  ];

  const accountMock: CreateAccountDto = {
    accountNumber: '478755',
    accountTypeId: 1,
    initialBalance: 2000,
    customerId: 'cf8804e7-cfbc-48be-90ab-e077932576b2'
  };

  beforeEach(async () => {
    mockCrudService.getAllCustomers.mockResolvedValue({
      customer: customersMock,
      page: 0,
      size: 10,
      totalElements: 2,
      totalPages: 1
    });

    await TestBed.configureTestingModule({
      declarations: [EditItemComponent],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: CrudService, useValue: mockCrudService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {}
            }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(EditItemComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  afterEach(() => {
    mockCrudService.createAccount.mockClear();
    mockCrudService.getAllCustomers.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load customers on init', () => {
    expect(mockCrudService.getAllCustomers).toHaveBeenCalled();
    expect(component.customers).toEqual(customersMock);
  });

  it('should initialize form with account fields', () => {
    expect(component.registerForm.get('accountNumber')).toBeDefined();
    expect(component.registerForm.get('accountTypeId')).toBeDefined();
    expect(component.registerForm.get('initialBalance')).toBeDefined();
    expect(component.registerForm.get('customerId')).toBeDefined();
  });

  it('should validate account number format', () => {
    const accountNumberControl = component.registerForm.get('accountNumber');
    
    accountNumberControl?.setValue('12345'); // Less than 6 digits
    expect(accountNumberControl?.valid).toBeFalsy();
    
    accountNumberControl?.setValue('1234567'); // More than 6 digits
    expect(accountNumberControl?.valid).toBeFalsy();
    
    accountNumberControl?.setValue('123456'); // Exactly 6 digits
    expect(accountNumberControl?.valid).toBeTruthy();
    
    accountNumberControl?.setValue('12345a'); // Contains non-numeric
    expect(accountNumberControl?.valid).toBeFalsy();
  });

  it('should validate initial balance format', () => {
    const initialBalanceControl = component.registerForm.get('initialBalance');
    
    initialBalanceControl?.setValue('1000'); // Integer
    expect(initialBalanceControl?.valid).toBeTruthy();
    
    initialBalanceControl?.setValue('1000.50'); // Decimal with 2 places
    expect(initialBalanceControl?.valid).toBeTruthy();
    
    initialBalanceControl?.setValue('1000.5'); // Decimal with 1 place
    expect(initialBalanceControl?.valid).toBeTruthy();
    
    initialBalanceControl?.setValue('1000.123'); // More than 2 decimal places
    expect(initialBalanceControl?.valid).toBeFalsy();
    
    initialBalanceControl?.setValue('-100'); // Negative number
    expect(initialBalanceControl?.valid).toBeFalsy();
    
    initialBalanceControl?.setValue('abc'); // Non-numeric
    expect(initialBalanceControl?.valid).toBeFalsy();
  });

  it('should create account successfully', async () => {
    mockCrudService.createAccount.mockResolvedValue({});
    
    component.registerForm.patchValue(accountMock);

    await component.onSubmit();

    expect(mockCrudService.createAccount).toHaveBeenCalledWith(accountMock);
    expect(component.successMessage).toBe('Cuenta creada correctamente');
  });

  it('should not create account because the form is invalid', async () => {
    await component.onSubmit();

    expect(mockCrudService.createAccount).toHaveBeenCalledTimes(0);
    expect(component.errorMessage).toBe('');
  });

  it('should handle 409 error correctly', async () => {
    const error = { status: 409 };
    mockCrudService.createAccount.mockRejectedValue(error);
    
    component.registerForm.patchValue(accountMock);

    await component.onSubmit();

    expect(component.errorMessage).toBe("Ya existe una cuenta con el número '478755' y tipo 'Ahorro'");
  });

  it('should handle generic error correctly', async () => {
    const error = { error: { message: 'Server error' } };
    mockCrudService.createAccount.mockRejectedValue(error);
    
    component.registerForm.patchValue(accountMock);

    await component.onSubmit();

    expect(component.errorMessage).toBe('Server error');
  });

  it('should execute resetForm', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');

    component.resetForm();

    expect(navigateSpy).toHaveBeenCalledWith(['../list'], {
      relativeTo: activatedRoute,
    });
  });
});
