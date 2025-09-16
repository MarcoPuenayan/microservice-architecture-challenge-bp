import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService, ConfirmationModalData } from '../../services/modal.service';

@Component({
  selector: 'app-confirmation-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="showModal" class="modal-backdrop" (click)="onBackdropClick()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ modalData?.title || 'Confirmación' }}</h4>
          </div>
          <div class="modal-body">
            <p>{{ modalData?.message || 'Mensaje por defecto' }}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="onCancel()">
              {{ modalData?.cancelText || 'Cancelar' }}
            </button>
            <button type="button" class="btn btn-primary" (click)="onConfirm()">
              {{ modalData?.confirmText || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
      z-index: 9999 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
    }

    .modal-dialog {
      max-width: 500px !important;
      width: 90% !important;
      margin: 0 auto !important;
    }

    .modal-content {
      background-color: #fff !important;
      border: 1px solid #dee2e6 !important;
      border-radius: 0.3rem !important;
      outline: 0 !important;
      position: relative !important;
      display: flex !important;
      flex-direction: column !important;
      width: 100% !important;
      pointer-events: auto !important;
      background-clip: padding-box !important;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
    }

    .modal-header {
      display: flex !important;
      align-items: flex-start !important;
      justify-content: space-between !important;
      padding: 1rem 1rem !important;
      border-bottom: 1px solid #dee2e6 !important;
      border-top-left-radius: calc(0.3rem - 1px) !important;
      border-top-right-radius: calc(0.3rem - 1px) !important;
    }

    .modal-title {
      margin: 0 !important;
      font-size: 1.25rem !important;
      font-weight: 500 !important;
      line-height: 1.2 !important;
      color: #212529 !important;
    }

    .modal-body {
      position: relative !important;
      flex: 1 1 auto !important;
      padding: 1rem !important;
    }

    .modal-body p {
      margin: 0 !important;
      color: #495057 !important;
      font-size: 1rem !important;
      line-height: 1.5 !important;
    }

    .modal-footer {
      display: flex !important;
      align-items: center !important;
      justify-content: flex-end !important;
      padding: 0.75rem !important;
      border-top: 1px solid #dee2e6 !important;
      border-bottom-right-radius: calc(0.3rem - 1px) !important;
      border-bottom-left-radius: calc(0.3rem - 1px) !important;
      gap: 0.5rem !important;
    }

    .btn {
      display: inline-block !important;
      font-weight: 400 !important;
      line-height: 1.5 !important;
      color: #212529 !important;
      text-align: center !important;
      text-decoration: none !important;
      vertical-align: middle !important;
      cursor: pointer !important;
      user-select: none !important;
      border: 1px solid transparent !important;
      padding: 0.375rem 0.75rem !important;
      font-size: 1rem !important;
      border-radius: 0.25rem !important;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out !important;
    }

    .btn-primary {
      color: #fff !important;
      background-color: #007bff !important;
      border-color: #007bff !important;
    }

    .btn-primary:hover {
      color: #fff !important;
      background-color: #0056b3 !important;
      border-color: #0056b3 !important;
    }

    .btn-secondary {
      color: #fff !important;
      background-color: #6c757d !important;
      border-color: #6c757d !important;
    }

    .btn-secondary:hover {
      color: #fff !important;
      background-color: #545b62 !important;
      border-color: #545b62 !important;
    }
  `]
})
export class ConfirmationModalComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions: Subscription[] = [];

  showModal = false;
  modalData: ConfirmationModalData | null = null;

  ngOnInit(): void {
    // Registrar este componente en el servicio
    this.modalService.registerConfirmationModal(this);

    this.subscriptions.push(
      this.modalService.confirmationModal$.subscribe(data => {
        this.modalData = data;
        this.showModal = !!data;
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      })
    );
  }

  // Método público para mostrar el modal directamente
  public showConfirmationModal(data: ConfirmationModalData): void {
    this.modalData = data;
    this.showModal = true;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onConfirm(): void {
    if (this.modalData) {
      this.modalData.onConfirm();
    }
    this.closeModal();
  }

  onCancel(): void {
    if (this.modalData) {
      this.modalData.onCancel();
    }
    this.closeModal();
  }

  onBackdropClick(): void {
    this.onCancel();
  }

  private closeModal(): void {
    this.showModal = false;
    this.modalData = null;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
