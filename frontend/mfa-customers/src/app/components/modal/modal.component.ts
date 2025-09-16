import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService, ConfirmationModalData } from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  template: `
    <!-- Confirmation Modal -->
    <div class="modal-overlay" *ngIf="confirmationData" (click)="onOverlayClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ confirmationData.title }}</h3>
        </div>
        
        <div class="modal-body">
          <p>{{ confirmationData.message }}</p>
        </div>
        
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-outline-secondary me-2"
            (click)="onCancel()"
          >
            {{ confirmationData.cancelText }}
          </button>
          
          <button 
            type="button" 
            class="btn btn-primary"
            (click)="onConfirm()"
          >
            {{ confirmationData.confirmText }}
          </button>
        </div>
      </div>
    </div>

    <!-- Alert Modal -->
    <div class="modal-overlay" *ngIf="alertData" (click)="onAlertOverlayClick()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ alertData.type === 'success' ? 'Éxito' : 'Error' }}</h3>
        </div>
        
        <div class="modal-body">
          <p [class]="alertData.type === 'success' ? 'text-success' : 'text-danger'">
            {{ alertData.message }}
          </p>
        </div>
        
        <div class="modal-footer">
          <button 
            type="button" 
            class="btn btn-primary"
            (click)="onAlertConfirm()"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      min-width: 400px;
      max-width: 500px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      animation: modalFadeIn 0.3s ease-out;
    }

    .modal-header {
      padding: 24px 24px 16px;
      border-bottom: 1px solid #e9ecef;
    }

    .modal-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
      color: #333;
    }

    .modal-body {
      padding: 16px 24px;
    }

    .modal-body p {
      margin: 0;
      font-size: 16px;
      color: #555;
    }

    .modal-footer {
      padding: 16px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }

    .btn-outline-secondary {
      background-color: transparent;
      border-color: #6c757d;
      color: #6c757d;
    }

    .btn-outline-secondary:hover {
      background-color: #6c757d;
      color: white;
    }

    .text-success {
      color: #28a745 !important;
    }

    .text-danger {
      color: #dc3545 !important;
    }

    .me-2 {
      margin-right: 8px;
    }

    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `]
})
export class ModalComponent implements OnInit, OnDestroy {
  private modalService = inject(ModalService);
  private subscriptions: Subscription[] = [];

  confirmationData: ConfirmationModalData | null = null;
  alertData: { message: string; type: 'success' | 'error' } | null = null;

  ngOnInit(): void {
    this.subscriptions.push(
      this.modalService.confirmationModal$.subscribe(data => {
        this.confirmationData = data;
      })
    );

    this.subscriptions.push(
      this.modalService.alertModal$.subscribe(data => {
        this.alertData = data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onConfirm(): void {
    if (this.confirmationData) {
      this.confirmationData.onConfirm();
    }
  }

  onCancel(): void {
    if (this.confirmationData) {
      this.confirmationData.onCancel();
    }
  }

  onOverlayClick(): void {
    this.onCancel();
  }

  onAlertConfirm(): void {
    this.modalService.hideAlert();
  }

  onAlertOverlayClick(): void {
    this.modalService.hideAlert();
  }
}
