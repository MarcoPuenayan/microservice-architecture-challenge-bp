import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Actions, Header, Row } from '@pichincha/ds-core';
import { CrudService } from '../../services/crud.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Transaction } from '../../interfaces/transaction.interface';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [],
})
export class ListItemsComponent implements OnInit {
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private crudService: CrudService = inject(CrudService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  itemss: Row[] = [];
  tableHeaders: Header[] = [];
  tableActions: Actions[] = [];
  showConfirmModal: boolean = false;
  transactionToDelete: string = '';
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;
  errorMessage: string = '';
  isDeleting: boolean = false;
  showNoDataModal: boolean = false;
  showErrorModal: boolean = false;
  modalMessage: string = '';
  isPermissionError: boolean = false;

  ngOnInit() {
    this.configTable();
    this.loadTransactions();
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  loadTransactions() {
    this.crudService.getAllTransactions().then((resp) => {
      this.itemss = resp.transactions.map((r) => this.mapTransactionRowData(r));
      this.cdr.detectChanges();
    }).catch((error) => {
      this.handleLoadError(error);
    });
  }

  configTable() {
    this.tableHeaders = [
      { id: 'accountNumber', label: 'Numero Cuenta' },
      { id: 'accountDescription', label: 'Tipo' },
      { id: 'balance', label: 'Saldo Inicial' },
      { id: 'status', label: 'Estado' },
      { id: 'movement', label: 'Movimiento' },
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
    this.router.navigate(['..', 'edit', rowData.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onClickDelete(rowData: Row) {
    this.transactionToDelete = rowData.id;
    this.showConfirmModal = true;
    // Force change detection to ensure modal displays
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  mapTransactionRowData = (row: Transaction) => {
    return {
      id: row.transactionId,
      label: '',
      columns: [
        {
          headerId: 'accountNumber',
          primaryText: row.accountNumber,
        },
        {
          headerId: 'accountDescription',
          primaryText: row.accountDescription || 'N/A',
        },
        {
          headerId: 'balance',
          primaryText: row.balance.toString(),
        },
        {
          headerId: 'status',
          primaryText: row.status ? 'Activo' : 'Inactivo',
        },
        {
          headerId: 'movement',
          primaryText: `${row.transactionTypeDescription} de ${row.transactionValue}`,
        },
      ],
    } as Row;
  };

  openConfirmModal(transactionId: string): void {
    this.transactionToDelete = transactionId;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.transactionToDelete = '';
    this.cdr.detectChanges();
  }

  confirmDelete(): void {
    if (this.transactionToDelete) {
      this.isDeleting = true;
      this.cdr.detectChanges(); // Update UI to show loading state
      this.crudService
        .deleteTransaction(this.transactionToDelete)
        .then(() => {
          this.showSuccessMessage = true;
          this.closeConfirmModal();
          this.loadTransactions(); // Refresh the table
          this.isDeleting = false;
          this.cdr.detectChanges();
          // Hide success message after 3 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
            this.cdr.detectChanges();
          }, 3000);
        })
        .catch((error) => {
          this.isDeleting = false;
          this.closeConfirmModal();
          this.handleDeleteError(error);
        });
    }
  }

  private handleDeleteError(error: any): void {
    let errorMessage = 'No se pudo eliminar la transacción. Intente nuevamente.';

    // Handle specific error structure from API
    if (error && error.errors && error.errors.length > 0) {
      const businessMessage = error.errors[0].businessMessage;
      if (businessMessage) {
        errorMessage = businessMessage;
      }
    }

    this.errorMessage = errorMessage;
    this.showErrorMessage = true;
    this.cdr.detectChanges();

    // Hide error message after 5 seconds
    setTimeout(() => {
      this.showErrorMessage = false;
      this.cdr.detectChanges();
    }, 5000);
  }

  private handleLoadError(error: any): void {
    // Check if it's a 404 error - no transactions found
    if (error && (error.status === 404 || error.statusCode === 404)) {
      this.showNoDataModal = true;
      this.itemss = []; // Clear the table
      this.cdr.detectChanges();
    } else if (error.status === 401 || error.status === 403) {
      this.modalMessage = 'No tiene permiso para ver las transacciones.';
      this.showErrorModal = true;
      // Marcar que el error es por permisos para inhabilitar el botón después
      this.isPermissionError = true;
      this.itemss = []; // Clear the table
      this.cdr.detectChanges();
    } else {
      // Para otros errores, mostrar mensaje genérico
      this.modalMessage = 'Error al cargar las transacciones. Intente nuevamente.';
      this.showErrorModal = true;
      this.isPermissionError = false; // No es error de permisos
      this.cdr.detectChanges();
    }
  }

  closeNoDataModal(): void {
    this.showNoDataModal = false;
    this.cdr.detectChanges();
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.cdr.detectChanges();
  }

  closeErrorMessage(): void {
    this.showErrorMessage = false;
    this.cdr.detectChanges();
  }
}
