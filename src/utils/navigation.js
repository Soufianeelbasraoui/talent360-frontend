import { Role } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';

export function getRoleDashboard(role) {
  if (role === Role.ADMIN) return ROUTES.ADMIN_DASHBOARD;
  if (role === Role.RECRUITER) return ROUTES.RECRUITER_DASHBOARD;
  if (role === Role.CANDIDATE) return ROUTES.CANDIDATE_DASHBOARD;
  return ROUTES.ROOT;
}

export function isPathAllowedForRole(pathname, role) {
  if (!pathname || typeof pathname !== 'string') return false;
  if (
    pathname === ROUTES.ROOT ||
    pathname === ROUTES.LOGIN ||
    pathname === ROUTES.REGISTER ||
    pathname === ROUTES.FORBIDDEN ||
    pathname === ROUTES.NOT_FOUND
  ) {
    return false;
  }

  // Admin routes
  if (pathname.startsWith('/admin')) {
    if (pathname.startsWith(ROUTES.ADMIN_DEPARTMENTS)) {
      return role === Role.ADMIN || role === Role.RECRUITER;
    }
    return role === Role.ADMIN;
  }

  // Recruiter routes
  if (pathname.startsWith('/recruiter')) {
    return role === Role.RECRUITER || role === Role.ADMIN;
  }

  // Candidate routes
  if (pathname.startsWith('/candidate')) {
    return role === Role.CANDIDATE;
  }

  // Shared / public authenticated routes (e.g. /jobs, /settings)
  return true;
}
