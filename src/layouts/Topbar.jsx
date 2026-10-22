import { useAuth } from '@/hooks/useAuth';
import { Menu, LogOut, User } from 'lucide-react';
import { Button } from '@/components/Button';
import { Role } from '@/constants/enums';

export function Topbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();

  const roleLabel =
    user?.role === Role.ADMIN
      ? 'Administrator'
      : user?.role === Role.RECRUITER
      ? 'Recruiter'
      : 'Candidate';

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn btn-secondary btn-sm d-lg-none p-1 border-0"
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <span className="small text-muted d-none d-md-inline">
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
            className="d-flex align-items-center justify-content-center bg-light text-primary rounded-circle border"
            style={{ width: '34px', height: '34px' }}
          >
            <User size={16} />
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
