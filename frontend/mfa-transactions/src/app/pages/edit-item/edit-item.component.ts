import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudService } from '../../services/crud.service';
import { Account, CreateTransactionDto, TransactionType } from '../../interfaces/account.interface';
import { Transaction, UpdateTransactionDto, AccountInfo } from '../../interfaces/transaction.interface';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styles: [],
})
export class EditItemComponent implements OnInit {
  registerForm!: FormGroup;
  accounts: Account[] = [];
  transactionTypes: TransactionType[] = [
    { id: 1, description: 'Depósito' },
    { id: 2, description: 'Retiro' }
  ];
  filteredAccounts: Account[] = [];
  showSuccessModal = false;
  errorMessage = '';
  isEditMode = false;
  currentTransaction: Transaction | null = null;
  accountInfo: AccountInfo | null = null;
  transactionId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService
  ) {}

  async ngOnInit() {
    this.transactionId = this.activatedRoute.snapshot.params['id'];
    this.isEditMode = !!this.transactionId;

    this.buildForm();

    if (this.isEditMode) {
      this.currentTransaction = this.activatedRoute.snapshot.data['transaction'];
      
      if (this.currentTransaction) {
        await this.loadAccountInfo(this.currentTransaction.accountNumber);
        
        setTimeout(() => {
          this.setEditForm();
        }, 100);
      }
    } else {
      await this.loadAccounts();
    }
  }

  buildForm() {
    if (this.isEditMode) {
      this.registerForm = this.fb.group({
        accountNumber: [{ value: null, disabled: true }, Validators.required],
        transactionTypeId: [{ value: null, disabled: true }, Validators.required],
        transactionValue: [{ value: null, disabled: true }, [Validators.required, Validators.min(0.01)]],
        balance: [null, [Validators.required, Validators.min(0)]],
        transactionDate: [{ value: null, disabled: true }, Validators.required],
        status: [null, Validators.required],
      });
    } else {
      this.registerForm = this.fb.group({
        accountNumber: [null, Validators.required],
        transactionTypeId: [null, Validators.required],
        transactionValue: [null, [Validators.required, Validators.min(0.01)]],
        transactionDate: [new Date().toISOString().slice(0, 16), Validators.required],
      });
    }
  }

  async loadAccounts() {
    try {
      const response = await this.crudService.getAllAccounts();
      this.accounts = response.accounts || [];
      this.filteredAccounts = [...this.accounts];
    } catch (error) {
      // Error loading accounts
    }
  }

  async loadAccountInfo(accountNumber: string) {
    try {
      this.accountInfo = await this.crudService.getAccountInfo(accountNumber);
    } catch (error) {
      // Error loading account info
    }
  }

  setEditForm() {
    if (this.currentTransaction && this.registerForm) {
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      let formattedDate = this.currentTransaction.transactionDate;
      if (formattedDate && !formattedDate.includes('T')) {
        // If date doesn't have time part, add default time
        formattedDate = formattedDate + 'T00:00';
      } else if (formattedDate && formattedDate.includes('.')) {
        // Remove milliseconds if present
        formattedDate = formattedDate.split('.')[0];
      }
      
      // Use patchValue for all fields since the form is now built correctly
      this.registerForm.patchValue({
        accountNumber: this.currentTransaction.accountNumber,
        transactionTypeId: this.currentTransaction.transactionTypeId,
        transactionValue: this.currentTransaction.transactionValue,
        balance: this.currentTransaction.balance,
        transactionDate: formattedDate,
        status: this.currentTransaction.status,
      });
    }
  }

  onAccountSearch(searchTerm: string) {
    if (!searchTerm) {
      this.filteredAccounts = [...this.accounts];
    } else {
      this.filteredAccounts = this.accounts.filter(account =>
        account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.accountDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  setValueForm(itemProduct: any) {
    // Not used for transaction creation - only for create mode
  }

  async onSubmit() {
    try {
      this.registerForm.markAllAsTouched();
      this.errorMessage = '';

      if (this.registerForm.invalid) {
        return;
      }

      if (this.isEditMode && this.transactionId) {
        // Update transaction - only send the editable fields
        const updateDto: UpdateTransactionDto = {
          accountNumber: this.currentTransaction!.accountNumber,
          transactionTypeId: this.currentTransaction!.transactionTypeId.toString(),
          transactionValue: this.currentTransaction!.transactionValue.toString(),
          balance: this.registerForm.get('balance')?.value.toString(),
          transactionDate: this.currentTransaction!.transactionDate,
          status: this.registerForm.get('status')?.value,
        };

        try {
          const result = await this.crudService.updateTransaction(this.transactionId, updateDto);
          this.showSuccessModal = true;
        } catch (updateError: any) {
          if (updateError?.status === 204) {
            this.showSuccessModal = true;
          } else {
            throw updateError;
          }
        }
      } else {
        // Create transaction
        const transactionDto: CreateTransactionDto = {
          accountNumber: this.registerForm.get('accountNumber')?.value,
          transactionTypeId: this.registerForm.get('transactionTypeId')?.value,
          transactionValue: this.registerForm.get('transactionValue')?.value,
          transactionDate: this.registerForm.get('transactionDate')?.value
        };

        await this.crudService.createTransaction(transactionDto);
        this.showSuccessModal = true;
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  handleError(error: any) {
    if (error?.status === 409) {
      this.errorMessage = error.error?.message || 'La transacción a editar no existe';
    } else if (error?.status === 404) {
      this.errorMessage = 'La transacción no fue encontrada';
    } else {
      this.errorMessage = this.isEditMode 
        ? 'Error al editar la transacción. Por favor, intente nuevamente.'
        : 'Error al crear la transacción. Por favor, intente nuevamente.';
    }
  }

  getEditOrCreate(data: any) {
    // Not used for transaction creation
    return Promise.resolve();
  }

  resetForm() {
    this.navigateListPage();
  }

  navigateListPage() {
    // Navigate absolutely to avoid relative path issues from /edit/{id}
    this.router.navigate(['/list']);
  }

  onSuccessModalClose() {
    this.showSuccessModal = false;
    this.navigateListPage();
  }

  //#region Getters
  get accountNumber(): FormControl {
    return this.registerForm.get('accountNumber') as FormControl;
  }

  get transactionTypeId(): FormControl {
    return this.registerForm.get('transactionTypeId') as FormControl;
  }

  get transactionValue(): FormControl {
    return this.registerForm.get('transactionValue') as FormControl;
  }

  get transactionDate(): FormControl {
    return this.registerForm.get('transactionDate') as FormControl;
  }

  get balance(): FormControl {
    return this.registerForm.get('balance') as FormControl;
  }

  get status(): FormControl {
    return this.registerForm.get('status') as FormControl;
  }

  //#endregion
}
