import { Injectable, ComponentRef, ViewContainerRef, ApplicationRef, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationModalData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private confirmationModalSubject = new BehaviorSubject<ConfirmationModalData | null>(null);
  private alertModalSubject = new BehaviorSubject<{ message: string; type: 'success' | 'error'; onClose?: () => void } | null>(null);

  public confirmationModal$ = this.confirmationModalSubject.asObservable();
  public alertModal$ = this.alertModalSubject.asObservable();

  // Referencia al componente modal
  public confirmationModalComponent: any = null;

  showConfirmation(data: ConfirmationModalData): void {
    // Intentar mostrar el modal usando el componente directamente
    if (this.confirmationModalComponent && this.confirmationModalComponent.showConfirmationModal) {
      this.confirmationModalComponent.showConfirmationModal(data);
    } else {
      this.confirmationModalSubject.next(data);
    }
  }

  hideConfirmation(): void {
    this.confirmationModalSubject.next(null);
  }

  showAlert(message: string, type: 'success' | 'error' = 'success', onClose?: () => void): void {
    this.alertModalSubject.next({ message, type, onClose });
  }

  hideAlert(): void {
    this.alertModalSubject.next(null);
  }

  // Método para registrar el componente modal
  registerConfirmationModal(component: any): void {
    this.confirmationModalComponent = component;
  }
}
