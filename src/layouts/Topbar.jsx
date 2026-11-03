import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';
import { Role } from '@/constants/enums';
import { ROUTES } from '@/constants/routes';

export function Topbar({ onToggleSidebar }) {
  const { user, candidateProfile, logout } = useAuth();

  const getUserInitials = () => {
    if (!user) return 'U';
    if (candidateProfile?.firstName && candidateProfile?.lastName) {
      return `${candidateProfile.firstName[0]}${candidateProfile.lastName[0]}`.toUpperCase();
    }
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.email) {
      const prefix = user.email.split('@')[0];
      const parts = prefix.split(/[._-]/).filter(Boolean);
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      if (prefix.length >= 2) {
        return prefix.substring(0, 2).toUpperCase();
      }
      return prefix.toUpperCase();
    }
    if (user.role && user.role.length >= 2) {
      return user.role.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const userInitials = getUserInitials();

  const roleLabel =
    user?.role === Role.ADMIN
      ? 'Administrator'
      : user?.role === Role.RECRUITER
      ? 'Recruiter'
      : 'Candidate';

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-2">
        {/* Return Arrow button to landing page */}
        <Link
          to={ROUTES.ROOT}
          className="btn btn-secondary btn-sm d-inline-flex align-items-center gap-1 py-1 px-2 border"
          title="Retourner à la page d'accueil"
          aria-label="Retourner à la page d'accueil"
        >
          <ArrowLeft size={16} />
          <span className="small d-none d-sm-inline fw-medium">Accueil</span>
        </Link>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm d-lg-none p-1 border-0"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <span className="small text-muted d-none d-md-inline ms-1">
          Talent360 Workspace
        </span>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2 text-end">
          <div className="d-none d-sm-block">
            <div className="small fw-semibold text-dark">{user?.email}</div>
            <div className="text-muted" style={{ fontSize: '0.6875rem' }}>
              {roleLabel}
            </div>
          </div>
          <div
            className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded border fw-bold"
            style={{ width: '34px', height: '34px', fontSize: '13px', letterSpacing: '0.5px' }}
          >
            {userInitials}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={logout}
          icon={<LogOut size={14} />}
          title="Sign out"
        >
          <span className="d-none d-sm-inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
