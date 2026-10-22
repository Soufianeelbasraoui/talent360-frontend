import clsx from 'clsx';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

/**
 * Toast item component.
 * @param {Object} props
 * @param {string} props.id
 * @param {'success'|'error'|'info'} props.type
 * @param {string} props.message
 * @param {() => void} props.onDismiss
 */
export function ToastItem({ type = 'info', message, onDismiss }) {
  const icon =
    type === 'success' ? (
      <CheckCircle2 size={18} className="text-success flex-shrink-0" />
    ) : type === 'error' ? (
      <AlertCircle size={18} className="text-danger flex-shrink-0" />
    ) : (
      <Info size={18} className="text-primary flex-shrink-0" />
    );

  return (
    <div
      className={clsx(
        'toast show d-flex align-items-center justify-content-between p-3 mb-2 bg-white',
        type === 'error' && 'border-danger-subtle',
        type === 'success' && 'border-success-subtle'
      )}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      style={{ minWidth: '300px', maxWidth: '450px' }}
    >
      <div className="d-flex align-items-center gap-2 text-start">
        {icon}
        <span className="small text-dark fw-medium">{message}</span>
      </div>
      <button
        type="button"
        className="btn-close ms-2"
        onClick={onDismiss}
        aria-label="Close toast"
      />
    </div>
  );
}

/**
 * Toast container fixed at top-right.
 * @param {Object} props
 * @param {Array<{ id: string, type: 'success'|'error'|'info', message: string }>} props.toasts
 * @param {(id: string) => void} props.onDismiss
 */
export function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1090, pointerEvents: 'none' }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onDismiss={() => onDismiss(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
