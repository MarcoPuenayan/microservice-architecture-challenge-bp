import { ModalService } from './app/services/modal.service';
import { CrudService } from './app/services/crud.service';

const modalService = new ModalService();

modalService.showConfirmation({
  title: 'Test',
  message: 'Test message',
  confirmText: 'Yes',
  cancelText: 'No',
  onConfirm: () => {},
  onCancel: () => {}
});

modalService.showAlert('Test alert', 'success');

export { modalService };
