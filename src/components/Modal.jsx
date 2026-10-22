import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { X } from 'lucide-react';

/**
 * Accessible modal dialog with 5px radius and ESC key dismiss.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} [props.title]
 * @param {'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {React.ReactNode} [props.footer]
 * @param {React.ReactNode} props.children
 */
export function Modal({ isOpen, onClose, title, size = 'md', footer, children }) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClass =
    size === 'sm'
      ? 'modal-sm'
      : size === 'lg'
      ? 'modal-lg'
      : size === 'xl'
      ? 'modal-xl'
      : '';

  return createPortal(
    <div
      className="modal d-block"
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className={clsx('modal-dialog modal-dialog-centered', sizeClass)}
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-content">
          {title && (
            <div className="modal-header d-flex align-items-center justify-content-between">
              <h5 className="modal-title fs-6 fw-semibold mb-0">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close modal"
              />
            </div>
          )}
          <div className="modal-body">{children}</div>
          {footer && <div className="modal-footer">{footer}</div>}
        </div>
      </div>
    </div>,
    document.body
  );
}
