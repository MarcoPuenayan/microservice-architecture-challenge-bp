import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditItemComponent } from './edit-item.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { ModalService } from '../../services/modal.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Customer } from 'src/app/interfaces/customer.interface';
import { CreateCustomerDto, UpdateCustomerDto } from 'src/app/types/customer.type';
import { PichinchaReactiveControlsModule } from '@pichincha/ds-angular';

describe('EditItemComponent', () => {
  let component: EditItemComponent;
  let fixture: ComponentFixture<EditItemComponent>;
  let router: Router;

  let mockCrudService = {
    update: jest.fn(),
    create: jest.fn(),
    createCustomer: jest.fn(),
    updateCustomer: jest.fn(),
  };

  let mockModalService = {
    showAlert: jest.fn(),
    hideAlert: jest.fn(),
  };

  const customerMock: Customer = {
    customerId: '1',
    name: 'Marco Puenayan',
    gender: 'Femenino',
    age: 28,
    identification: '0956298477',
    address: 'Norte',
    phone: '0979847154',
    status: true,
  };

  const createCustomerMock: CreateCustomerDto = {
    name: 'Marco Puenayan',
    gender: 'Femenino',
    age: 28,
    identification: '0956298477',
    address: 'Norte',
    phone: '0979847154',
    password: '1234',
  };

  const updateCustomerMock: UpdateCustomerDto = {
    name: 'Marco Puenayan Actualizado',
    gender: 'Femenino',
    age: 29,
    identification: '0979847154',
    address: 'Sur',
    phone: '0956298467',
    status: true,
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
        { provide: ModalService, useValue: mockModalService }
      ],
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockCrudService.create.mockRestore();
    mockCrudService.update.mockRestore();
    mockCrudService.createCustomer.mockRestore();
    mockCrudService.updateCustomer.mockRestore();
    mockModalService.showAlert.mockClear();
    mockModalService.hideAlert.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute setValueForm with a customer', () => {
    component.setValueForm(customerMock);

    expect(component.registerForm.getRawValue()).toStrictEqual({
      name: 'Marco Puenayan',
      gender: 'Femenino',
      age: 28,
      identification: '0956298477',
      address: 'Norte',
      phone: '0979847154',
      password: '',
      status: true,
    });
  });

  it('should create customer successfully', async () => {
    const navigateMock = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    mockCrudService.createCustomer.mockResolvedValue({});
    
    component.registerForm.patchValue(createCustomerMock);

    await component.onSubmit();

    expect(mockCrudService.createCustomer).toHaveBeenCalledWith(createCustomerMock);
    expect(mockModalService.showAlert).toHaveBeenCalledWith('Cliente creado correctamente', 'success');
  });

  it('should show error when form is invalid', async () => {
    await component.onSubmit();

    expect(mockCrudService.createCustomer).not.toHaveBeenCalled();
    expect(mockModalService.showAlert).toHaveBeenCalledWith('Por favor complete todos los campos correctamente', 'error');
  });

  it('should validate name field - only letters', () => {
    component.name.setValue('John123');
    expect(component.name.invalid).toBeTruthy();
    expect(component.name.errors?.['pattern']).toBeTruthy();

    component.name.setValue('John Doe');
    expect(component.name.valid).toBeTruthy();
  });

  it('should validate identification field - exactly 10 digits', () => {
    component.identification.setValue('123456789'); // 9 digits
    expect(component.identification.invalid).toBeTruthy();
    expect(component.identification.errors?.['pattern']).toBeTruthy();

    component.identification.setValue('12345678901'); // 11 digits
    expect(component.identification.invalid).toBeTruthy();
    expect(component.identification.errors?.['pattern']).toBeTruthy();

    component.identification.setValue('0956298477'); // 10 digits
    expect(component.identification.valid).toBeTruthy();
  });

  it('should validate age field - maximum 3 digits and minimum 18', () => {
    component.age.setValue(17);
    expect(component.age.invalid).toBeTruthy();
    expect(component.age.errors?.['min']).toBeTruthy();

    component.age.setValue(1000);
    expect(component.age.invalid).toBeTruthy();
    expect(component.age.errors?.['max']).toBeTruthy();

    component.age.setValue(28);
    expect(component.age.valid).toBeTruthy();
  });

  it('should validate phone field - between 7 and 10 digits', () => {
    component.phone.setValue('123456'); // 6 digits
    expect(component.phone.invalid).toBeTruthy();
    expect(component.phone.errors?.['pattern']).toBeTruthy();

    component.phone.setValue('12345678901'); // 11 digits
    expect(component.phone.invalid).toBeTruthy();
    expect(component.phone.errors?.['pattern']).toBeTruthy();

    component.phone.setValue('0979847154'); // 10 digits
    expect(component.phone.valid).toBeTruthy();

    component.phone.setValue('2345678'); // 7 digits
    expect(component.phone.valid).toBeTruthy();
  });

  it('should handle 409 error (customer already exists)', async () => {
    const error = { 
      status: 409, 
      error: {
        errors: [{
          code: "409",
          message: "CONFLICT",
          businessMessage: "Customer with identification: 0956298477, already exists."
        }]
      }
    };
    mockCrudService.createCustomer.mockRejectedValue(error);
    
    component.registerForm.patchValue(createCustomerMock);

    await component.onSubmit();

    expect(mockModalService.showAlert).toHaveBeenCalledWith('Ya existe un cliente con la cédula ingresada', 'error');
  });

  it('should handle 409 error without businessMessage', async () => {
    const error = { status: 409 };
    mockCrudService.createCustomer.mockRejectedValue(error);
    
    component.registerForm.patchValue(createCustomerMock);

    await component.onSubmit();

    expect(mockModalService.showAlert).toHaveBeenCalledWith('Ya existe un cliente con la cédula ingresada', 'error');
  });

  it('should handle generic error', async () => {
    const error = { status: 500, error: { message: 'Server error' } };
    mockCrudService.createCustomer.mockRejectedValue(error);
    
    component.registerForm.patchValue(createCustomerMock);

    await component.onSubmit();

    expect(mockModalService.showAlert).toHaveBeenCalledWith('Server error', 'error');
  });

  it('should execute resetForm', () => {
    const navigateMock = jest.spyOn(router, 'navigate').mockResolvedValue(true);

    component.resetForm();

    expect(navigateMock).toBeCalledTimes(1);
  });

  it('should update customer successfully', async () => {
    const navigateMock = jest.spyOn(router, 'navigate').mockResolvedValue(true);
    mockCrudService.updateCustomer.mockResolvedValue({});
    
    // Setup component as editing mode
    component.editForm = true;
    component.customerId = 'test-uuid';
    component.registerForm.patchValue(updateCustomerMock);

    await component.onSubmit();

    expect(mockCrudService.updateCustomer).toHaveBeenCalledWith('test-uuid', updateCustomerMock);
    expect(mockModalService.showAlert).toHaveBeenCalledWith('Cliente editado correctamente', 'success');
  });

  it('should handle update error with 409 status (customer not found)', async () => {
    const error = { 
      status: 409, 
      error: {
        errors: [{
          code: "404",
          message: "NOT_FOUND",
          businessMessage: "Customer not found with ID: test-uuid"
        }]
      }
    };
    mockCrudService.updateCustomer.mockRejectedValue(error);
    
    component.editForm = true;
    component.customerId = 'test-uuid';
    component.registerForm.patchValue(createCustomerMock);

    await component.onSubmit();

    expect(mockModalService.showAlert).toHaveBeenCalledWith('El cliente a editar no existe', 'error');
  });

  it('should set customer data correctly when editing', () => {
    component.setValueForm(customerMock);

    expect(component.editForm).toBe(true);
    expect(component.customerId).toBe('1');
    expect(component.registerForm.getRawValue()).toStrictEqual({
      name: 'Marco Puenayan',
      gender: 'Femenino',
      age: 28,
      identification: '0956298477',
      address: 'Norte',
      phone: '0979847154',
      password: '',
      status: true,
    });
  });

  it('should require password in creation mode and not in edit mode', () => {
    // Test creation mode (password required)
    component.setValueForm(null);
    expect(component.editForm).toBe(false);
    expect(component.registerForm.get('password')?.hasError('required')).toBe(true);
    expect(component.registerForm.get('identification')?.disabled).toBe(false);

    // Test edit mode (password not required, identification disabled)
    component.setValueForm(customerMock);
    expect(component.editForm).toBe(true);
    expect(component.registerForm.get('password')?.hasError('required')).toBe(false);
    expect(component.registerForm.get('identification')?.disabled).toBe(true);
  });

  it('should handle 404 error with new error structure', async () => {
    const error = { 
      status: 404, 
      error: {
        title: "Customer Exception",
        detail: "There is a problem executing your transaction.",
        errors: [{
          code: "404",
          message: "NOT_FOUND",
          businessMessage: "Customer not found with ID: da70b3c5-1ca4-408a-a583-6ab29e79b651"
        }]
      }
    };
    mockCrudService.updateCustomer.mockRejectedValue(error);
    
    component.editForm = true;
    component.customerId = 'test-uuid';
    component.registerForm.patchValue(updateCustomerMock);

    await component.onSubmit();

    expect(mockModalService.showAlert).toHaveBeenCalledWith('El cliente a editar no existe', 'error');
  });
});
