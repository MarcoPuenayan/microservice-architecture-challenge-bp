import { Component, inject, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-alert-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-backdrop" *ngIf="showModal" (click)="onBackdropClick()">
      <div class="modal-dialog" (click)="$event.stopPropagation()">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{ alertData?.type === 'success' ? 'Éxito' : 'Error' }}</h4>
          </div>
          <div class="modal-body">
            <p [class]="alertData?.type === 'success' ? 'text-success' : 'text-danger'">
              {{ alertData?.message }}
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" (click)="onClose()">
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 1050;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-dialog {
      max-width: 500px;
      width: 90%;
      margin: 0 auto;
    }

    .modal-content {
      background-color: #fff;
      border: 1px solid #dee2e6;
      border-radius: 0.3rem;
      outline: 0;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      pointer-events: auto;
      background-clip: padding-box;
      box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1rem 1rem;
      border-bottom: 1px solid #dee2e6;
      border-top-left-radius: calc(0.3rem - 1px);
      border-top-right-radius: calc(0.3rem - 1px);
    }

    .modal-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 500;
      line-height: 1.2;
      color: #212529;
    }

    .modal-body {
      position: relative;
      flex: 1 1 auto;
      padding: 1rem;
    }

    .modal-body p {
      margin: 0;
      font-size: 1rem;
      line-height: 1.5;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 0.75rem;
      border-top: 1px solid #dee2e6;
      border-bottom-right-radius: calc(0.3rem - 1px);
      border-bottom-left-radius: calc(0.3rem - 1px);
      gap: 0.5rem;
    }

    .btn {
      display: inline-block;
      font-weight: 400;
      line-height: 1.5;
      color: #212529;
      text-align: center;
      text-decoration: none;
      vertical-align: middle;
      cursor: pointer;
      user-select: none;
      border: 1px solid transparent;
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      border-radius: 0.25rem;
      transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }

    .btn-primary {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    }

    .btn-primary:hover {
      color: #fff;
      background-color: #0056b3;
      border-color: #0056b3;
    }

    .text-success {
      color: #28a745 !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }
  `]
})
export class AlertModalComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private cdr = inject(ChangeDetectorRef);
  private subscriptions: Subscription[] = [];

  showModal = false;
  alertData: { message: string; type: 'success' | 'error'; onClose?: () => void } | null = null;

  ngOnInit(): void {
    this.subscriptions.push(
      this.modalService.alertModal$.subscribe(data => {
        this.alertData = data;
        this.showModal = !!data;
        
        // Forzar detección de cambios
        this.cdr.markForCheck();
        this.cdr.detectChanges();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onClose(): void {
    // Ejecutar callback si existe antes de cerrar el modal
    if (this.alertData?.onClose) {
      this.alertData.onClose();
    }
    
    this.modalService.hideAlert();
    this.closeModal();
  }

  onBackdropClick(): void {
    this.onClose();
  }

  private closeModal(): void {
    this.showModal = false;
    this.alertData = null;
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }
}
