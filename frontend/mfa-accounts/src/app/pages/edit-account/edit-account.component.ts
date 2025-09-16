import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositAccount } from '../../interfaces/deposit-account.interface';
import { Customer } from '../../interfaces/customer.interface';
import { CrudService } from '../../services/crud.service';
import { UpdateAccountDto, AccountType } from '../../types/account.type';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styles: [`
    .alert {
      padding: 10px;
      margin-bottom: 15px;
      border-radius: 4px;
      font-size: 14px;
    }
    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #333;
    }
    .form-control {
      display: block;
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      color: #495057;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid #ced4da;
      border-radius: 0.375rem;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    .form-control:focus {
      color: #495057;
      background-color: #fff;
      border-color: #80bdff;
      outline: 0;
      box-shadow: 0 0 0 0.2rem rgb(0 123 255 / 25%);
    }
    .form-control:disabled {
      background-color: #e9ecef;
      opacity: 1;
    }
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    .invalid-feedback {
      display: block;
      width: 100%;
      margin-top: 0.25rem;
      font-size: 0.875em;
      color: #dc3545;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .success-modal {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      min-width: 400px;
      max-width: 500px;
      animation: modalFadeIn 0.3s ease-out;
    }
    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
    }
    .modal-header h4 {
      margin: 0;
      color: #28a745;
      font-size: 1.25rem;
    }
    .modal-body {
      padding: 20px;
    }
    .modal-body p {
      margin: 0;
      color: #333;
      font-size: 1rem;
    }
    .modal-footer {
      padding: 20px;
      border-top: 1px solid #e9ecef;
      text-align: right;
    }
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(-50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
})
export class EditAccountComponent {
  editForm!: FormGroup;
  account: DepositAccount | null = null;
  customer: Customer | null = null;
  accountTypes: AccountType[] = [
    { id: 1, description: 'Ahorro' },
    { id: 2, description: 'Corriente' }
  ];
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private cdr: ChangeDetectorRef
  ) {
    this.buildForm();
    this.loadAccountData();
  }

  buildForm() {
    this.editForm = this.fb.group({
      accountNumber: [{ value: '', disabled: true }],
      accountTypeId: [{ value: null, disabled: true }],
      initialBalance: [0, [Validators.required, Validators.min(0)]],
      customerId: [{ value: '', disabled: true }],
      customerName: [{ value: '', disabled: true }],
      status: ['', [Validators.required]]
    });
  }

  async loadAccountData() {
    try {
      const { account } = this.activatedRoute.snapshot.data;
      if (account) {
        this.account = account;
        
        // Si el account no tiene accountId, usar el ID de la ruta
        if (!this.account?.accountId) {
          const accountId = this.activatedRoute.snapshot.params['id'];
          if (this.account) {
            this.account.accountId = accountId;
          }
        }
        
        await this.loadCustomerData(account.customerId);
        this.populateForm();
      } else {
        this.errorMessage = 'No se encontraron datos de la cuenta';
      }
    } catch (error) {
      console.error('Error loading account data:', error);
      this.errorMessage = 'Error al cargar los datos de la cuenta';
    }
  }

  async loadCustomerData(customerId: string) {
    try {
      this.customer = await this.crudService.getCustomerById(customerId);
    } catch (error) {
      console.error('Error loading customer data:', error);
      this.customer = null;
    }
  }

  populateForm() {
    if (!this.account) return;
    
    const formData = {
      accountNumber: this.account.accountNumber,
      accountTypeId: this.account.accountTypeId,
      initialBalance: this.account.initialBalance,
      customerId: this.account.customerId,
      customerName: this.customer?.name || 'Cliente no encontrado',
      status: this.account.status ? 'true' : 'false'
    };
    
    this.editForm.patchValue(formData);
    this.editForm.updateValueAndValidity();
    this.cdr.detectChanges();
  }

  async onSubmit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    
    if (this.isLoading) {
      return;
    }
    
    try {
      this.editForm.markAllAsTouched();
      this.errorMessage = '';
      this.successMessage = '';

      if (this.editForm.invalid || !this.account?.accountId) {
        return;
      }

      this.isLoading = true;
      const formValue = this.editForm.getRawValue();
      
      const updateDto: UpdateAccountDto = {
        accountNumber: formValue.accountNumber,
        accountTypeId: formValue.accountTypeId,
        initialBalance: Number(formValue.initialBalance),
        customerId: formValue.customerId,
        status: formValue.status === 'true'
      };

      await this.crudService.updateAccount(this.account.accountId, updateDto);
      
      this.successMessage = 'Cuenta editada correctamente';
      this.cdr.detectChanges();
      
    } catch (error: any) {
      console.error('Error updating account:', error);
      
      // Verificar si es un error 204 (No Content) que debería ser considerado éxito
      if (error.status === 204) {
        this.successMessage = 'Cuenta editada correctamente';
        this.cdr.detectChanges();
        return;
      }
      
      if (error.status === 404) {
        this.errorMessage = 'La cuenta a editar no existe';
      } else if (error.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Error al editar la cuenta. Intente nuevamente.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  resetForm() {
    this.navigateListPage();
  }

  navigateListPage() {
    this.router.navigate(['/list']);
  }

  getAccountTypeDescription(accountTypeId: number): string {
    return this.accountTypes.find(type => type.id === accountTypeId)?.description || 'Desconocido';
  }

  //#region Getters
  get accountNumber(): FormControl {
    return this.editForm.get('accountNumber') as FormControl;
  }

  get accountTypeId(): FormControl {
    return this.editForm.get('accountTypeId') as FormControl;
  }

  get initialBalance(): FormControl {
    return this.editForm.get('initialBalance') as FormControl;
  }

  get customerId(): FormControl {
    return this.editForm.get('customerId') as FormControl;
  }

  get customerName(): FormControl {
    return this.editForm.get('customerName') as FormControl;
  }

  get status(): FormControl {
    return this.editForm.get('status') as FormControl;
  }

  //#endregion
}
