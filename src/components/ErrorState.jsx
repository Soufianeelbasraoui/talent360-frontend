import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Unable to load data',
  message = 'Check your connection and try again.',
  onRetry,
}) {
  return (
    <div className="card text-center py-5 px-3 border-danger-subtle bg-white">
      <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 bg-danger-subtle text-danger rounded-circle mx-auto">
        <AlertCircle size={32} />
      </div>
      <h3 className="fs-6 fw-semibold text-danger mb-1">{title}</h3>
      <p className="text-muted small mb-3 mx-auto" style={{ maxWidth: '420px' }}>
        {message}
      </p>
      {onRetry && (
        <div className="mt-2">
          <Button variant="secondary" size="sm" onClick={onRetry} icon={<RotateCcw size={14} />}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
