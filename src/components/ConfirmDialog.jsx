import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle } from 'lucide-react';

/**
 * Confirmation dialog for destructive actions.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {() => void} props.onConfirm
 * @param {string} props.title
 * @param {string} props.message
 * @param {string} [props.confirmLabel='Delete']
 * @param {string} [props.cancelLabel='Cancel']
 * @param {boolean} [props.isLoading=false]
 * @param {'danger'|'primary'} [props.variant='danger']
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      footer={
        <div className="d-flex justify-content-end gap-2 w-100">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="d-flex align-items-start gap-3 py-2">
        <div className="text-danger flex-shrink-0 mt-1">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="fs-6 fw-semibold text-dark mb-1">{title}</h4>
          <p className="text-muted small mb-0">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
