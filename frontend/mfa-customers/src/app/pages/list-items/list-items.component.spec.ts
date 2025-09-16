import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsComponent } from './list-items.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../../services/crud.service';
import { ModalService } from '../../services/modal.service';
import { Router } from '@angular/router';
import { Customer, CustomerResponse } from '../../interfaces/customer.interface';
import { Row } from '@pichincha/ds-core';

describe('ListItemsComponent', () => {
  let component: ListItemsComponent;
  let fixture: ComponentFixture<ListItemsComponent>;
  let router: Router;
  let mockCrudService: jest.Mocked<CrudService>;
  let mockModalService: jest.Mocked<ModalService>;

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

  const mockCustomerResponse: CustomerResponse = {
    customer: [mockCustomer],
    page: 0,
    size: 10,
    totalElements: 1,
    totalPages: 1
  };

  beforeEach(async () => {
    mockCrudService = {
      getAll: jest.fn().mockResolvedValue({ products: [] }),
      getAllCustomers: jest.fn().mockResolvedValue(mockCustomerResponse),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createCustomer: jest.fn(),
      deleteCustomer: jest.fn().mockResolvedValue({}),
    } as any;

    mockModalService = {
      showConfirmation: jest.fn(),
      hideConfirmation: jest.fn(),
      showAlert: jest.fn(),
      hideAlert: jest.fn(),
      confirmationModal$: jest.fn(),
      alertModal$: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      declarations: [ListItemsComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: CrudService, useValue: mockCrudService },
        { provide: ModalService, useValue: mockModalService }
      ],
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

  it('should load customers on init', async () => {
    expect(mockCrudService.getAllCustomers).toHaveBeenCalledWith(0, 10);
    expect(component.itemss.length).toBe(1);
    expect(component.totalElements).toBe(1);
    expect(component.totalPages).toBe(1);
  });

  it('should map customer data correctly', () => {
    const mappedRow = component.mapCustomerRowData(mockCustomer);
    
    expect(mappedRow.id).toBe('test-uuid');
    expect(mappedRow.columns[0].primaryText).toBe('1234567890'); // identification
    expect(mappedRow.columns[1].primaryText).toBe('Test Customer'); // name
    expect(mappedRow.columns[2].primaryText).toBe('Masculino'); // gender
    expect(mappedRow.columns[3].primaryText).toBe('30'); // age
    expect(mappedRow.columns[4].primaryText).toBe('Test Address'); // address
    expect(mappedRow.columns[5].primaryText).toBe('0987654321'); // phone
    expect(mappedRow.columns[6].primaryText).toBe('Activo'); // status
  });

  it('should display "Inactivo" for inactive customer status', () => {
    const inactiveCustomer = { ...mockCustomer, status: false };
    const mappedRow = component.mapCustomerRowData(inactiveCustomer);
    
    expect(mappedRow.columns[6].primaryText).toBe('Inactivo');
  });

  it('should load customers for specific page', () => {
    component.totalPages = 5; // Set totalPages to allow page navigation
    component.onPageChange(2);
    
    expect(mockCrudService.getAllCustomers).toHaveBeenCalledWith(2, 10);
  });

  it('should not load customers for invalid page numbers', () => {
    component.totalPages = 5;
    component.currentPage = 0;
    const initialCallCount = mockCrudService.getAllCustomers.mock.calls.length;
    
    // Try to navigate to negative page
    component.onPageChange(-1);
    expect(mockCrudService.getAllCustomers.mock.calls.length).toBe(initialCallCount);
    
    // Try to navigate beyond total pages
    component.onPageChange(5);
    expect(mockCrudService.getAllCustomers.mock.calls.length).toBe(initialCallCount);
  });

  it('should configure table headers correctly', () => {
    component.configTable();
    
    expect(component.tableHeaders).toHaveLength(7);
    expect(component.tableHeaders[0].label).toBe('Cédula');
    expect(component.tableHeaders[1].label).toBe('Nombre');
    expect(component.tableHeaders[2].label).toBe('Género');
    expect(component.tableHeaders[3].label).toBe('Edad');
    expect(component.tableHeaders[4].label).toBe('Dirección');
    expect(component.tableHeaders[5].label).toBe('Teléfono');
    expect(component.tableHeaders[6].label).toBe('Estado');
  });

  it('should have Math property available for template', () => {
    expect(component.Math).toBe(Math);
  });

  it('should show confirmation modal when delete is clicked', () => {
    const mockRow: Row = {
      id: 'test-uuid',
      label: '',
      columns: []
    };

    component.onClickDelete(mockRow);

    expect(mockModalService.showConfirmation).toHaveBeenCalledWith({
      title: 'Confirmar eliminación',
      message: '¿Está seguro que desea eliminar este cliente?',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: expect.any(Function),
      onCancel: expect.any(Function)
    });
  });

  it('should delete customer successfully', async () => {
    const customerId = 'test-uuid';
    mockCrudService.deleteCustomer.mockResolvedValue({});

    await component['deleteCustomer'](customerId);

    expect(mockCrudService.deleteCustomer).toHaveBeenCalledWith(customerId);
    expect(mockModalService.hideConfirmation).toHaveBeenCalled();
    expect(mockModalService.showAlert).toHaveBeenCalledWith('Cliente eliminado correctamente', 'success');
    expect(mockCrudService.getAllCustomers).toHaveBeenCalledWith(0, 10);
  });

  it('should handle delete error with business message', async () => {
    const customerId = 'test-uuid';
    const errorResponse = {
      errors: [{
        code: '404',
        message: 'NOT_FOUND',
        businessMessage: 'Customer not found with ID: test-uuid'
      }]
    };
    mockCrudService.deleteCustomer.mockRejectedValue(errorResponse);

    await component['deleteCustomer'](customerId);

    expect(mockModalService.hideConfirmation).toHaveBeenCalled();
    expect(mockModalService.showAlert).toHaveBeenCalledWith('Customer not found with ID: test-uuid', 'error');
  });

  it('should handle delete error with generic message', async () => {
    const customerId = 'test-uuid';
    const errorResponse = {
      message: 'Network error'
    };
    mockCrudService.deleteCustomer.mockRejectedValue(errorResponse);

    await component['deleteCustomer'](customerId);

    expect(mockModalService.hideConfirmation).toHaveBeenCalled();
    expect(mockModalService.showAlert).toHaveBeenCalledWith('Network error', 'error');
  });

  it('should handle delete error with default message', async () => {
    const customerId = 'test-uuid';
    mockCrudService.deleteCustomer.mockRejectedValue({});

    await component['deleteCustomer'](customerId);

    expect(mockModalService.hideConfirmation).toHaveBeenCalled();
    expect(mockModalService.showAlert).toHaveBeenCalledWith('No se pudo eliminar el cliente. Intente nuevamente.', 'error');
  });

  it('should extract business message from error correctly', () => {
    const errorWithBusinessMessage = {
      errors: [{
        code: '404',
        message: 'NOT_FOUND',
        businessMessage: 'Customer not found'
      }]
    };

    const result = component['extractErrorMessage'](errorWithBusinessMessage);
    expect(result).toBe('Customer not found');
  });

  it('should extract generic message from error correctly', () => {
    const errorWithMessage = {
      message: 'Network error'
    };

    const result = component['extractErrorMessage'](errorWithMessage);
    expect(result).toBe('Network error');
  });

  it('should return default message for unknown error', () => {
    const result = component['extractErrorMessage']({});
    expect(result).toBe('No se pudo eliminar el cliente. Intente nuevamente.');
  });
});
