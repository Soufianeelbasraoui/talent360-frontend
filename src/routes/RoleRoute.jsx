import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Skeleton } from '@/components/Skeleton';

export function RoleRoute({ allowedRoles = [], children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="p-4 w-100">
        <Skeleton count={4} height={45} className="mb-3" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}
