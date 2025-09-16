import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../interfaces/customer.interface';
import { CrudService } from '../../services/crud.service';
import { CreateAccountDto, AccountType } from '../../types/account.type';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
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
export class EditItemComponent {
  registerForm!: FormGroup;
  customers: Customer[] = [];
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
    private crudService: CrudService
  ) {
    this.buildForm();
    this.loadCustomers();
  }

  buildForm() {
    this.registerForm = this.fb.group({
      accountNumber: [null, [Validators.required, Validators.pattern(/^\d{6}$/)]],
      accountTypeId: [null, Validators.required],
      initialBalance: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      customerId: [null, Validators.required],
    });
  }

  async loadCustomers() {
    try {
      const response = await this.crudService.getAllCustomers();
      this.customers = response.customer || [];
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  async onSubmit() {
    try {
      this.registerForm.markAllAsTouched();
      this.errorMessage = '';
      this.successMessage = '';

      if (this.registerForm.invalid) {
        return;
      }

      this.isLoading = true;
      const formValue = this.registerForm.getRawValue();
      
      const accountDto: CreateAccountDto = {
        accountNumber: formValue.accountNumber,
        accountTypeId: Number(formValue.accountTypeId),
        initialBalance: Number(formValue.initialBalance),
        customerId: formValue.customerId
      };

      const response = await this.crudService.createAccount(accountDto);
      
      this.successMessage = 'Cuenta creada correctamente';
      
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      if (error.status === 409) {
        const accountType = this.accountTypes.find(type => type.id === this.registerForm.get('accountTypeId')?.value);
        this.errorMessage = `Ya existe una cuenta con el número '${this.registerForm.get('accountNumber')?.value}' y tipo '${accountType?.description}'`;
      } else if (error.error?.message) {
        this.errorMessage = error.error.message;
      } else {
        this.errorMessage = 'Error al crear la cuenta. Intente nuevamente.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  resetForm() {
    this.navigateListPage();
  }

  navigateListPage() {
    this.router.navigate(['../list'], {
      relativeTo: this.activatedRoute,
    });
  }

  //#region Getters
  get accountNumber(): FormControl {
    return this.registerForm.get('accountNumber') as FormControl;
  }

  get accountTypeId(): FormControl {
    return this.registerForm.get('accountTypeId') as FormControl;
  }

  get initialBalance(): FormControl {
    return this.registerForm.get('initialBalance') as FormControl;
  }

  get customerId(): FormControl {
    return this.registerForm.get('customerId') as FormControl;
  }

  //#endregion
}
