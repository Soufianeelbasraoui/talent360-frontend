import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Skeleton } from '@/components/Skeleton';

/**
 * Guard that requires an active authenticated session.
 */
export function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-4">
        <div style={{ width: '320px' }}>
          <Skeleton count={3} height={36} className="mb-3" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return children;
}
