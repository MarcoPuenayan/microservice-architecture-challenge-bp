import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Actions, Header, Row } from '@pichincha/ds-core';
import { CrudService } from '../../services/crud.service';
import { ModalService } from '../../services/modal.service';
import { ActivatedRoute, Router } from '@angular/router';

import { Product } from '../../interfaces/product.interface';
import { Customer } from '../../interfaces/customer.interface';
import { ApiError } from '../../interfaces/error.interface';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styles: [`
    .pagination-container {
      border-top: 1px solid #e9ecef;
      padding-top: 16px;
    }
    .gap-2 {
      gap: 8px;
    }
  `],
})
export class ListItemsComponent implements OnInit, OnDestroy {
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private crudService: CrudService = inject(CrudService);
  private modalService: ModalService = inject(ModalService);

  itemss: Row[] = [];
  currentPage: number = 0;
  pageSize: number = 10;
  totalElements: number = 0;
  totalPages: number = 0;

  tableHeaders: Header[] = [];
  tableActions: Actions[] = [];
  
  // Control de permisos para el botón Nuevo Cliente
  isNewClientButtonDisabled: boolean = false;
  
  // Make Math available in template
  Math = Math;

  ngOnInit() {
    this.configTable();
    this.loadCustomers();
  }

  ngOnDestroy() {}

  loadCustomers(page: number = 0): void {
    this.crudService.getAllCustomers(page, this.pageSize).then((resp) => {
      this.itemss = resp.customer.map((customer) => this.mapCustomerRowData(customer));
      this.currentPage = resp.page;
      this.totalElements = resp.totalElements;
      this.totalPages = resp.totalPages;
    }).catch((error) => {
      console.error('Error loading customers:', error);
      
      // Verificar si es un error 404 para mostrar mensaje específico
      if (error.status === 404) {
        this.modalService.showAlert('No existen clientes por mostrar', 'error');
      } else if (error.status === 401 || error.status === 403) {
        // Para errores de permisos, mostrar modal con callback para deshabilitar botón
        this.modalService.showAlert('No tiene permiso para ver los clientes', 'error', () => {
          this.isNewClientButtonDisabled = true;
        });
      } else {
        // Para otros errores, mostrar mensaje genérico
        this.modalService.showAlert('Error al cargar los clientes. Intente nuevamente.', 'error');
      }
      
      // Reset pagination on error
      this.itemss = [];
      this.currentPage = 0;
      this.totalElements = 0;
      this.totalPages = 0;
    });
  }

  configTable() {
    this.tableHeaders = [
      { id: 'identification', label: 'Cédula', width: '150px' },
      { id: 'name', label: 'Nombre', width: '200px' },
      { id: 'gender', label: 'Género', width: '100px' },
      { id: 'age', label: 'Edad', width: '80px' },
      { id: 'address', label: 'Dirección', width: '200px' },
      { id: 'phone', label: 'Teléfono', width: '150px' },
      { id: 'status', label: 'Estado', width: '100px' },
    ];

    this.tableActions = [
      {
        id: 'editar',
        label: 'Editar',
        action: (row) => this.onClickEdit(row),
      },
      {
        id: 'eliminar',
        label: 'Eliminar',
        action: (row) => this.onClickDelete(row),
      },
    ];
  }

  newItem(): void {
    // Prevenir navegación si el botón está deshabilitado
    if (this.isNewClientButtonDisabled) {
      return;
    }
    
    this.router.navigate(['..', 'edit'], { relativeTo: this.activatedRoute });
  }

  onClickEdit(rowData: Row) {
    this.router.navigate(['..', 'edit', rowData.id], {
      relativeTo: this.activatedRoute,
    });
  }

  onClickDelete(rowData: Row) {
    this.modalService.showConfirmation({
      title: 'Confirmar eliminación',
      message: '¿Está seguro que desea eliminar este cliente?',
      confirmText: 'Sí',
      cancelText: 'No',
      onConfirm: () => this.deleteCustomer(rowData.id),
      onCancel: () => this.modalService.hideConfirmation()
    });
  }

  private deleteCustomer(customerId: string): void {
    this.crudService.deleteCustomer(customerId)
      .then((response: any) => {
        // Eliminación exitosa - mostrar mensaje de éxito
        this.modalService.showAlert('Cliente eliminado correctamente', 'success');
        this.loadCustomers(this.currentPage);
      })
      .catch((error: any) => {
        console.error('Error deleting customer:', error);
        const errorMessage = this.extractErrorMessage(error);
        this.modalService.showAlert(errorMessage, 'error');
      });
  }

  private extractErrorMessage(error: any): string {
    if (error && error.errors && error.errors.length > 0) {
      const businessMessage = error.errors[0].businessMessage;
      if (businessMessage) {
        return businessMessage;
      }
    }
    
    if (error && error.message) {
      return error.message;
    }
    
    return 'No se pudo eliminar el cliente. Intente nuevamente.';
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadCustomers(page);
    }
  }

  mapCustomerRowData = (customer: Customer): Row => {
    return {
      id: customer.customerId,
      label: '',
      columns: [
        {
          headerId: 'identification',
          primaryText: customer.identification,
        },
        {
          headerId: 'name',
          primaryText: customer.name,
        },
        {
          headerId: 'gender',
          primaryText: customer.gender,
        },
        {
          headerId: 'age',
          primaryText: customer.age.toString(),
        },
        {
          headerId: 'address',
          primaryText: customer.address,
        },
        {
          headerId: 'phone',
          primaryText: customer.phone,
        },
        {
          headerId: 'status',
          primaryText: customer.status ? 'Activo' : 'Inactivo',
        },
      ],
    };
  };

  mapProductRowData = (row: Product) => {
    return {
      id: row.id.toString(),
      label: '',
      columns: [
        {
          headerId: 'title',
          primaryText: row.title,
        },
        {
          headerId: 'description',
          primaryText: row.description,
        },
        {
          headerId: 'price',
          primaryText: row.price,
        },
        {
          headerId: 'discountPercentage',
          primaryText: row.discountPercentage,
        },
      ],
    } as Row;
  };
}
