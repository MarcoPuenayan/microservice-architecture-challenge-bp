import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show confirmation modal', () => {
    const mockData = {
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };

    service.showConfirmation(mockData);

    service.confirmationModal$.subscribe(data => {
      expect(data).toEqual(mockData);
    });
  });

  it('should hide confirmation modal', () => {
    const mockData = {
      title: 'Test Title',
      message: 'Test Message',
      confirmText: 'Yes',
      cancelText: 'No',
      onConfirm: jest.fn(),
      onCancel: jest.fn()
    };

    service.showConfirmation(mockData);
    service.hideConfirmation();

    service.confirmationModal$.subscribe(data => {
      expect(data).toBeNull();
    });
  });

  it('should show alert modal', () => {
    const message = 'Test Alert';
    const type = 'success' as const;

    service.showAlert(message, type);

    service.alertModal$.subscribe(data => {
      expect(data).toEqual({ message, type });
    });
  });

  it('should hide alert modal', () => {
    service.showAlert('Test Alert', 'success');
    service.hideAlert();

    service.alertModal$.subscribe(data => {
      expect(data).toBeNull();
    });
  });

  it('should show alert modal with default success type', () => {
    const message = 'Test Alert';

    service.showAlert(message);

    service.alertModal$.subscribe(data => {
      expect(data).toEqual({ message, type: 'success' });
    });
  });
});
