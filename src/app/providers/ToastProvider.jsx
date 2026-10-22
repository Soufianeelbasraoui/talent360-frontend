import { createContext, useState, useCallback, useMemo } from 'react';
import { ToastContainer } from '@/components/Toast';

export const ToastContext = createContext(null);

/**
 * Toast Provider managing global flash toast notifications.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback(id => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback(
    (message, type = 'info', durationMs = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast = { id, message, type };

      setToasts(prev => [...prev, newToast]);

      if (durationMs > 0) {
        setTimeout(() => {
          removeToast(id);
        }, durationMs);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message, duration) => addToast(message, 'success', duration),
    [addToast]
  );
  const error = useCallback(
    (message, duration) => addToast(message, 'error', duration),
    [addToast]
  );
  const info = useCallback(
    (message, duration) => addToast(message, 'info', duration),
    [addToast]
  );

  const value = useMemo(
    () => ({ addToast, success, error, info, removeToast }),
    [addToast, success, error, info, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
