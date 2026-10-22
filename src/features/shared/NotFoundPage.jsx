import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-light">
      <div
        className="card p-4 p-md-5 text-center mx-auto border shadow-sm"
        style={{ maxWidth: '480px' }}
      >
        <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 bg-light text-muted rounded-circle mx-auto">
          <HelpCircle size={40} />
        </div>
        <h1 className="fs-4 fw-bold text-dark mb-2">404 — Page Not Found</h1>
        <p className="text-muted small mb-4">
          The screen you are looking for doesn&apos;t exist, was moved, or is temporarily unavailable.
        </p>
        <Link to={ROUTES.ROOT} className="d-inline-block">
          <Button variant="primary" size="sm" icon={<ArrowLeft size={14} />}>
            Back to safe ground
          </Button>
        </Link>
      </div>
    </div>
  );
}
