import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { ROUTES } from '@/constants/routes';

export function ForbiddenPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4 bg-light">
      <div
        className="card p-4 p-md-5 text-center mx-auto border shadow-sm"
        style={{ maxWidth: '480px' }}
      >
        <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 bg-danger-subtle text-danger rounded-circle mx-auto">
          <ShieldAlert size={40} />
        </div>
        <h1 className="fs-4 fw-bold text-dark mb-2">403 — Access Restricted</h1>
        <p className="text-muted small mb-4">
          You do not have permission to view this resource. If you believe this is an error, please reach out to your administrator.
        </p>
        <Link to={ROUTES.ROOT} className="d-inline-block">
          <Button variant="primary" size="sm" icon={<ArrowLeft size={14} />}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
