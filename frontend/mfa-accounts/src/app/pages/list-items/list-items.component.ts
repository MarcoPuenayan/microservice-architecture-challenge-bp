import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { Actions, Header, Row } from '@pichincha/ds-core';
import { CrudService, ErrorResponse } from '../../services/crud.service';
import { ActivatedRoute, Router } from '@angular/router';

import { DepositAccount } from '../../interfaces/deposit-account.interface';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [`
    .modal-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      z-index: 9999 !important;
    }
    .confirm-modal {
      background-color: white !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
      min-width: 400px !important;
      max-width: 500px !important;
      animation: modalFadeIn 0.3s ease-out !important;
    }
    .success-modal {
      background-color: white !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
      min-width: 400px !important;
      max-width: 500px !important;
      animation: modalFadeIn 0.3s ease-out !important;
    }
    .error-modal {
      background-color: white !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
      min-width: 400px !important;
      max-width: 500px !important;
      animation: modalFadeIn 0.3s ease-out !important;
    }
    .modal-header {
      padding: 20px !important;
      border-bottom: 1px solid #e9ecef !important;
    }
    .modal-header h4 {
      margin: 0 !important;
      font-size: 1.25rem !important;
    }
    .modal-header .confirm h4 {
      color: #ffc107 !important;
    }
    .modal-header .success h4 {
      color: #28a745 !important;
    }
    .modal-header .error h4 {
      color: #dc3545 !important;
    }
    .modal-body {
      padding: 20px !important;
    }
    .modal-body p {
      margin: 0 !important;
      color: #333 !important;
      font-size: 1rem !important;
    }
    .modal-footer {
      padding: 20px !important;
      border-top: 1px solid #e9ecef !important;
      text-align: right !important;
      display: flex !important;
      justify-content: flex-end !important;
      gap: 10px !important;
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
export class ListItemsComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private crudService: CrudService = inject(CrudService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  itemss: Row[] = [];
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;

  tableHeaders: Header[] = [];
  tableActions: Actions[] = [];
  
  // Modal states
  showConfirmModal: boolean = false;
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  showNoAccountsModal: boolean = false;
  modalMessage: string = '';
  accountToDelete: Row | null = null;
  isDeleting: boolean = false;
  newAccountButtonDisabled: boolean = false;
  isPermissionError: boolean = false;

  Math = Math; // Make Math available in template

  ngOnInit() {
    this.configTable();
    this.loadAccounts();
  }

  ngOnDestroy() {}

  loadAccounts() {
    this.crudService.getAllDepositAccounts(this.currentPage, this.pageSize)
      .then((resp) => {
        this.itemss = resp.accounts.map((account) => this.mapDepositAccountRowData(account));
        this.totalPages = resp.totalPages;
        this.totalElements = resp.totalElements;
      })
      .catch((error) => {
        console.error('Error loading accounts:', error);
        
        // Si es un error 404, mostrar modal de "no hay cuentas"
        if (error.status === 404) {
          this.showNoAccountsModal = true;
          this.itemss = []; // Limpiar la lista
          this.totalPages = 0;
          this.totalElements = 0;
        } if (error.status === 401 || error.status === 403 ) {
          this.modalMessage = 'No tiene permiso para ver las cuentas.';
          this.showErrorModal = true;
          // Marcar que el error es por permisos para inhabilitar el botón después
          this.isPermissionError = true;
        } else {
          // Para otros errores, mantener el comportamiento actual
          this.modalMessage = 'Error al cargar las cuentas. Intente nuevamente.';
          this.showErrorModal = true;
          this.isPermissionError = false; // No es error de permisos
        }
        this.cdr.detectChanges();
      });
  }

  configTable() {
    this.tableHeaders = [
      { id: 'accountNumber', label: 'Numero Cuenta' },
      { id: 'accountTypeDescription', label: 'Tipo', width: '200px' },
      { id: 'initialBalance', label: 'Saldo Inicial', width: '150px' },
      { id: 'customerName', label: 'Cliente', width: '200px' },
      { id: 'status', label: 'Estado', width: '100px' },
    ];

    this.tableActions = [
      {
        id: 'editar',
        label: 'Editar',
        action: this.onClickEdit.bind(this),
      },
      {
        id: 'eliminar',
        label: 'Eliminar',
        action: this.onClickDelete.bind(this),
      },
    ];
  }

  newItem(): void {
    this.router.navigate(['..', 'edit'], { relativeTo: this.activatedRoute });
  }

  onClickEdit(rowData: Row) {
    this.router.navigate(['..', 'edit-account', rowData.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onClickDelete(rowData: Row) {
    this.accountToDelete = rowData;
    this.showConfirmModal = true;
    this.cdr.detectChanges();
  }

  confirmDelete() {
    if (!this.accountToDelete) return;

    this.isDeleting = true;
    this.crudService.deleteDepositAccount(this.accountToDelete.id)
      .then((response) => {
        // Success - handle 204 No Content response
        this.showConfirmModal = false;
        this.modalMessage = 'Cuenta eliminada correctamente';
        this.showSuccessModal = true;
        this.loadAccounts(); // Refresh the table
        this.cdr.detectChanges();
      })
      .catch((error) => {
        this.showConfirmModal = false;
        this.handleDeleteError(error);
        this.cdr.detectChanges();
      })
      .finally(() => {
        this.isDeleting = false;
        this.accountToDelete = null;
      });
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.accountToDelete = null;
    this.cdr.detectChanges();
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    this.modalMessage = '';
    this.cdr.detectChanges();
  }

  closeErrorModal() {
    // Si el error fue por permisos, inhabilitar el botón de Nueva Cuenta
    if (this.isPermissionError) {
      this.newAccountButtonDisabled = true;
    }
    
    this.showErrorModal = false;
    this.modalMessage = '';
    this.isPermissionError = false; // Reset la bandera
    this.cdr.detectChanges();
  }

  closeNoAccountsModal() {
    this.showNoAccountsModal = false;
    this.cdr.detectChanges();
  }

  private handleDeleteError(error: any) {
    let errorMessage = 'No se pudo eliminar la cuenta. Intente nuevamente.';
    
    if (error && error.errors && error.errors.length > 0) {
      const businessMessage = error.errors[0].businessMessage;
      if (businessMessage) {
        errorMessage = businessMessage;
      }
    }
    
    this.modalMessage = errorMessage;
    this.showErrorModal = true;
    this.cdr.detectChanges();
  }

  onNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAccounts();
    }
  }

  onPreviousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAccounts();
    }
  }

  mapDepositAccountRowData = (account: DepositAccount) => {
    return {
      id: account.accountNumber,
      label: '',
      columns: [
        {
          headerId: 'accountNumber',
          primaryText: account.accountNumber,
        },
        {
          headerId: 'accountTypeDescription',
          primaryText: account.accountTypeDescription,
        },
        {
          headerId: 'initialBalance',
          primaryText: account.initialBalance.toString(),
        },
        {
          headerId: 'customerName',
          primaryText: account.customerName || 'No asignado',
        },
        {
          headerId: 'status',
          primaryText: account.status ? 'Activo' : 'Inactivo',
        },
      ],
    } as Row;
  };
}
