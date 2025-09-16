import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer } from '../../interfaces/customer.interface';
import { CreateCustomerDto, UpdateCustomerDto, CustomerErrorResponse } from '../../types/customer.type';
import { CrudService } from '../../services/crud.service';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styles: [],
})
export class EditItemComponent {
  registerForm!: FormGroup;
  editForm: boolean = false;
  customerId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private crudService: CrudService,
    private modalService: ModalService
  ) {
    this.buildForm();

    const { customer } = activatedRoute.snapshot.data;

    this.setValueForm(customer || null);
  }

  buildForm() {
    this.registerForm = this.fb.group({
      name: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/) // Solo letras, acentos y espacios
      ]],
      gender: ['', Validators.required],
      identification: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/) // Exactamente 10 dígitos
      ]],
      age: [null, [
        Validators.required,
        Validators.min(18),
        Validators.max(999) // Máximo 3 dígitos
      ]],
      address: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\d{7,10}$/) // Entre 7 y 10 dígitos
      ]],
      password: [''], // Se agregará validación conditionally
      status: [true, Validators.required],
    });

    // Clear messages when user starts typing - no longer needed with modal
    // this.registerForm.valueChanges.subscribe(() => {
    //   if (this.errorMessage || this.successMessage) {
    //     this.clearMessages();
    //   }
    // });
  }

  setValueForm(itemCustomer: Customer | null) {
    if (!itemCustomer) {
      // Modo creación - password es requerido
      this.registerForm.get('password')?.setValidators([Validators.required]);
      this.registerForm.get('password')?.updateValueAndValidity();
      return;
    }

    this.editForm = true;
    this.customerId = itemCustomer.customerId;
    this.registerForm.patchValue(itemCustomer);
    
    // Deshabilitar el campo de identificación cuando estamos editando
    this.registerForm.get('identification')?.disable();
    
    // Remover validación de password en modo edición
    this.registerForm.get('password')?.clearValidators();
    this.registerForm.get('password')?.updateValueAndValidity();
  }

  async onSubmit() {
    try {
      this.registerForm.markAllAsTouched();

      if (this.registerForm.invalid) {
        this.showErrorMessage('Por favor complete todos los campos correctamente');
        return;
      }

      if (this.editForm && this.customerId) {
        const updateData: UpdateCustomerDto = this.registerForm.getRawValue();
        await this.updateCustomer(this.customerId, updateData);
        this.showSuccessMessage('Cliente editado correctamente');
      } else {
        const createData: CreateCustomerDto = this.registerForm.getRawValue();
        await this.createCustomer(createData);
        this.showSuccessMessage('Cliente creado correctamente');
      }
      
      setTimeout(() => {
        this.navigateListPage();
      }, 3000);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private handleError(error: any) {
    console.error('Error with customer operation:', error);
    
    // Manejar errores con la estructura específica del backend
    if (error.status === 404 || error.status === 409 || error.status === 400) {
      const errorResponse: CustomerErrorResponse = error.error;
      
      if (errorResponse?.errors && errorResponse.errors.length > 0) {
        const businessMessage = errorResponse.errors[0].businessMessage;
        if (businessMessage) {
          // Traducir mensajes comunes al español
          let spanishMessage = businessMessage;
          
          if (businessMessage.includes('already exists')) {
            spanishMessage = 'Ya existe un cliente con la cédula ingresada';
          } else if (businessMessage.includes('not found') || businessMessage.includes('Customer not found')) {
            spanishMessage = 'El cliente a editar no existe';
          } else {
            // Mantener el mensaje original si no es uno de los casos específicos
            spanishMessage = businessMessage;
          }
          
          this.showErrorMessage(spanishMessage);
        } else {
          // Mensajes por defecto según el código de error
          if (error.status === 404) {
            this.showErrorMessage('El cliente a editar no existe');
          } else if (error.status === 409) {
            this.showErrorMessage('Ya existe un cliente con la cédula ingresada');
          } else {
            const operation = this.editForm ? 'editar' : 'crear';
            this.showErrorMessage(`Error al ${operation} el cliente. Intente nuevamente.`);
          }
        }
      } else {
        // Si no hay errores en la estructura, usar mensajes por defecto
        if (error.status === 404) {
          this.showErrorMessage('El cliente a editar no existe');
        } else if (error.status === 409) {
          this.showErrorMessage('Ya existe un cliente con la cédula ingresada');
        } else {
          const operation = this.editForm ? 'editar' : 'crear';
          this.showErrorMessage(`Error al ${operation} el cliente. Intente nuevamente.`);
        }
      }
    } else if (error.error?.message) {
      this.showErrorMessage(error.error.message);
    } else {
      const operation = this.editForm ? 'editar' : 'crear';
      this.showErrorMessage(`Error al ${operation} el cliente. Intente nuevamente.`);
    }
  }

  private showSuccessMessage(message: string) {
    // Usar el modal del Design System
    this.modalService.showAlert(message, 'success');
  }

  private showErrorMessage(message: string) {
    // Usar el modal del Design System
    this.modalService.showAlert(message, 'error');
  }

  createCustomer(customerDto: CreateCustomerDto) {
    return this.crudService.createCustomer(customerDto);
  }

  updateCustomer(customerId: string, customerDto: UpdateCustomerDto) {
    return this.crudService.updateCustomer(customerId, customerDto);
  }

  resetForm() {
    this.navigateListPage();
  }

  private clearMessages() {
    // No longer needed - using modal instead
  }

  navigateListPage() {
    const route = this.editForm ? ['../..'] : ['..'];
    this.router.navigate([...route, 'list'], {
      relativeTo: this.activatedRoute,
    });
  }

  //#region Getters
  get name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }

  get gender(): FormControl {
    return this.registerForm.get('gender') as FormControl;
  }

  get identification(): FormControl {
    return this.registerForm.get('identification') as FormControl;
  }

  get age(): FormControl {
    return this.registerForm.get('age') as FormControl;
  }

  get address(): FormControl {
    return this.registerForm.get('address') as FormControl;
  }

  get phone(): FormControl {
    return this.registerForm.get('phone') as FormControl;
  }

  get password(): FormControl | null {
    return this.registerForm.get('password') as FormControl;
  }

  get status(): FormControl {
    return this.registerForm.get('status') as FormControl;
  }

  //#endregion
}
