import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal.service';
import { PichinchaButtonModule, PichinchaTypographyModule } from '@pichincha/ds-angular';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let modalService: ModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      imports: [
        PichinchaButtonModule,
        PichinchaTypographyModule
      ],
      providers: [ModalService]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(ModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirmation modal when data is provided', () => {
    const mockData = {
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };

    modalService.showConfirmation(mockData);
    fixture.detectChanges();

    expect(component.confirmationData).toEqual(mockData);
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const mockData = {
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };

    modalService.showConfirmation(mockData);
    fixture.detectChanges();

    component.onConfirm();

    expect(mockData.onConfirm).toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    const mockData = {
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };

    modalService.showConfirmation(mockData);
    fixture.detectChanges();

    component.onCancel();

    expect(mockData.onCancel).toHaveBeenCalled();
  });

  it('should show alert modal when alert data is provided', () => {
    const mockAlert = {
      message: 'Test Alert',
      type: 'success' as const
    };

    modalService.showAlert(mockAlert.message, mockAlert.type);
    fixture.detectChanges();

    expect(component.alertData).toEqual(mockAlert);
  });

  it('should hide alert modal when onAlertConfirm is called', () => {
    const mockAlert = {
      message: 'Test Alert',
      type: 'success' as const
    };

    modalService.showAlert(mockAlert.message, mockAlert.type);
    fixture.detectChanges();

    component.onAlertConfirm();

    expect(component.alertData).toBeNull();
  });
});
