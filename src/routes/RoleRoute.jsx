import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

/**
 * Guard that ensures current user has one of the allowed roles.
 * @param {Object} props
 * @param {Array<'ADMIN'|'RECRUITER'|'CANDIDATE'>} props.allowedRoles
 * @param {React.ReactNode} props.children
 */
export function RoleRoute({ allowedRoles = [], children }) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}
