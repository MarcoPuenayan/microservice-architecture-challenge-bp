import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsComponent } from './list-items.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CrudService } from '../../services/crud.service';
import { Router } from '@angular/router';
import { ResponseDepositAccounts, DepositAccount } from '../../interfaces/deposit-account.interface';

describe('ListItemsComponent', () => {
  let component: ListItemsComponent;
  let fixture: ComponentFixture<ListItemsComponent>;
  let router: Router;
  let crudService: CrudService;

  const mockDepositAccounts: DepositAccount[] = [
    {
      accountNumber: '478755',
      accountTypeId: 1,
      accountTypeDescription: 'Ahorro',
      initialBalance: 2050.0,
      customerId: 'd2fb3804-2305-4c1d-b34a-715f886456ea',
      customerName: 'Juan Pérez',
      status: true
    },
    {
      accountNumber: '478756',
      accountTypeId: 2,
      accountTypeDescription: 'Corriente',
      initialBalance: 1500.0,
      customerId: 'd2fb3804-2305-4c1d-b34a-715f886456eb',
      customerName: null,
      status: false
    }
  ];

  const mockResponse: ResponseDepositAccounts = {
    accounts: mockDepositAccounts,
    page: 0,
    size: 5,
    totalElements: 2,
    totalPages: 1
  };

  let mockCrudService = {
    getAll: jest.fn().mockResolvedValue({ products: [] }),
    getAllDepositAccounts: jest.fn().mockResolvedValue(mockResponse),
    delete: jest.fn(),
    deleteDepositAccount: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemsComponent],
      imports: [RouterTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: CrudService, useValue: mockCrudService }],
    }).compileComponents();
    router = TestBed.inject(Router);
    crudService = TestBed.inject(CrudService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should load deposit accounts on init', async () => {
    expect(crudService.getAllDepositAccounts).toHaveBeenCalledWith(0, 5);
    expect(component.itemss.length).toBe(2);
    expect(component.totalPages).toBe(1);
    expect(component.totalElements).toBe(2);
  });

  it('should configure table headers correctly', () => {
    expect(component.tableHeaders).toEqual([
      { id: 'accountNumber', label: 'Numero Cuenta' },
      { id: 'accountTypeDescription', label: 'Tipo', width: '200px' },
      { id: 'initialBalance', label: 'Saldo Inicial', width: '150px' },
      { id: 'customerName', label: 'Cliente', width: '200px' },
      { id: 'status', label: 'Estado', width: '100px' },
    ]);
  });

  it('should map deposit account data correctly', () => {
    const account = mockDepositAccounts[0];
    const mappedData = component.mapDepositAccountRowData(account);
    
    expect(mappedData.id).toBe('478755');
    expect(mappedData.columns[0].primaryText).toBe('478755');
    expect(mappedData.columns[1].primaryText).toBe('Ahorro');
    expect(mappedData.columns[2].primaryText).toBe('2050');
    expect(mappedData.columns[3].primaryText).toBe('Juan Pérez');
    expect(mappedData.columns[4].primaryText).toBe('Activo');
  });

  it('should handle null customer name', () => {
    const account = mockDepositAccounts[1];
    const mappedData = component.mapDepositAccountRowData(account);
    
    expect(mappedData.columns[3].primaryText).toBe('No asignado');
  });

  it('should show correct status text', () => {
    const activeAccount = mockDepositAccounts[0];
    const inactiveAccount = mockDepositAccounts[1];
    
    const activeMapped = component.mapDepositAccountRowData(activeAccount);
    const inactiveMapped = component.mapDepositAccountRowData(inactiveAccount);
    
    expect(activeMapped.columns[4].primaryText).toBe('Activo');
    expect(inactiveMapped.columns[4].primaryText).toBe('Inactivo');
  });

  it('should go to next page when onNextPage is called', () => {
    component.currentPage = 0;
    component.totalPages = 2;
    const loadAccountsSpy = jest.spyOn(component, 'loadAccounts');
    
    component.onNextPage();
    
    expect(component.currentPage).toBe(1);
    expect(loadAccountsSpy).toHaveBeenCalled();
  });

  it('should not go to next page if already on last page', () => {
    component.currentPage = 1;
    component.totalPages = 2;
    const loadAccountsSpy = jest.spyOn(component, 'loadAccounts');
    
    component.onNextPage();
    
    expect(component.currentPage).toBe(1);
    expect(loadAccountsSpy).not.toHaveBeenCalled();
  });

  it('should go to previous page when onPreviousPage is called', () => {
    component.currentPage = 1;
    const loadAccountsSpy = jest.spyOn(component, 'loadAccounts');
    
    component.onPreviousPage();
    
    expect(component.currentPage).toBe(0);
    expect(loadAccountsSpy).toHaveBeenCalled();
  });

  it('should not go to previous page if already on first page', () => {
    component.currentPage = 0;
    const loadAccountsSpy = jest.spyOn(component, 'loadAccounts');
    
    component.onPreviousPage();
    
    expect(component.currentPage).toBe(0);
    expect(loadAccountsSpy).not.toHaveBeenCalled();
  });

  // Delete functionality tests
  it('should show confirmation modal when onClickDelete is called', () => {
    const rowData = { id: '478755', label: '', columns: [] };
    
    component.onClickDelete(rowData);
    
    expect(component.showConfirmModal).toBe(true);
    expect(component.accountToDelete).toBe(rowData);
  });

  it('should cancel delete when cancelDelete is called', () => {
    const rowData = { id: '478755', label: '', columns: [] };
    component.accountToDelete = rowData;
    component.showConfirmModal = true;
    
    component.cancelDelete();
    
    expect(component.showConfirmModal).toBe(false);
    expect(component.accountToDelete).toBeNull();
  });

  it('should successfully delete account and show success modal', async () => {
    const rowData = { id: '478755', label: '', columns: [] };
    component.accountToDelete = rowData;
    mockCrudService.deleteDepositAccount.mockResolvedValue({});
    const loadAccountsSpy = jest.spyOn(component, 'loadAccounts');
    
    await component.confirmDelete();
    
    expect(mockCrudService.deleteDepositAccount).toHaveBeenCalledWith('478755');
    expect(component.showConfirmModal).toBe(false);
    expect(component.showSuccessModal).toBe(true);
    expect(component.modalMessage).toBe('Cuenta eliminada correctamente');
    expect(component.accountToDelete).toBeNull();
    expect(loadAccountsSpy).toHaveBeenCalled();
  });

  it('should handle delete error and show error modal', async () => {
    const rowData = { id: '478755', label: '', columns: [] };
    component.accountToDelete = rowData;
    const errorResponse = {
      errors: [{ businessMessage: 'Account not found with number: 478755' }]
    };
    mockCrudService.deleteDepositAccount.mockRejectedValue(errorResponse);
    
    await component.confirmDelete();
    
    expect(component.showConfirmModal).toBe(false);
    expect(component.showErrorModal).toBe(true);
    expect(component.modalMessage).toBe('Account not found with number: 478755');
    expect(component.accountToDelete).toBeNull();
  });

  it('should handle delete error without business message', async () => {
    const rowData = { id: '478755', label: '', columns: [] };
    component.accountToDelete = rowData;
    mockCrudService.deleteDepositAccount.mockRejectedValue({});
    
    await component.confirmDelete();
    
    expect(component.showConfirmModal).toBe(false);
    expect(component.showErrorModal).toBe(true);
    expect(component.modalMessage).toBe('No se pudo eliminar la cuenta. Intente nuevamente.');
  });

  it('should close success modal when closeSuccessModal is called', () => {
    component.showSuccessModal = true;
    component.modalMessage = 'Test message';
    
    component.closeSuccessModal();
    
    expect(component.showSuccessModal).toBe(false);
    expect(component.modalMessage).toBe('');
  });

  it('should close error modal when closeErrorModal is called', () => {
    component.showErrorModal = true;
    component.modalMessage = 'Test error message';
    
    component.closeErrorModal();
    
    expect(component.showErrorModal).toBe(false);
    expect(component.modalMessage).toBe('');
  });

  it('should not proceed with delete if no account is selected', async () => {
    component.accountToDelete = null;
    const deleteSpy = jest.spyOn(mockCrudService, 'deleteDepositAccount');
    
    await component.confirmDelete();
    
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
