import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';
import { Topbar } from './Topbar';
import {
  Target,
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Search,
  Send,
  Users,
  Building2,
  LineChart,
  Settings,
  Sparkles,
} from 'lucide-react';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const closeSidebar = () => setSidebarOpen(false);

  const renderNavLinks = () => {
    if (!user) return null;

    if (user.role === Role.CANDIDATE) {
      return (
        <>
          <div className="nav-section-title">Candidate Menu</div>
          <NavLink
            to={ROUTES.CANDIDATE_DASHBOARD}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={ROUTES.CANDIDATE_PROFILE}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <User size={18} />
            <span>My Profile</span>
          </NavLink>
          <NavLink
            to={ROUTES.CANDIDATE_CV}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <FileText size={18} />
            <span>My CV</span>
          </NavLink>
          <NavLink
            to={`${ROUTES.JOBS}?tab=recommended`}
            onClick={closeSidebar}
            className={({ isActive }) =>
              clsx(
                'nav-item',
                isActive && location.search.includes('tab=recommended') && 'active'
              )
            }
          >
            <Sparkles size={18} className="text-success" />
            <span>Recommended Jobs</span>
          </NavLink>
          <NavLink
            to={`${ROUTES.JOBS}?tab=all`}
            onClick={closeSidebar}
            className={({ isActive }) =>
              clsx(
                'nav-item',
                isActive && !location.search.includes('tab=recommended') && 'active'
              )
            }
          >
            <Search size={18} />
            <span>All Jobs</span>
          </NavLink>
          <NavLink
            to={ROUTES.CANDIDATE_APPLICATIONS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Send size={18} />
            <span>My Applications</span>
          </NavLink>
        </>
      );
    }

    if (user.role === Role.RECRUITER) {
      return (
        <>
          <div className="nav-section-title">Recruiter Menu</div>
          <NavLink
            to={ROUTES.RECRUITER_DASHBOARD}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={ROUTES.RECRUITER_JOBS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Briefcase size={18} />
            <span>Job Offers</span>
          </NavLink>
          <NavLink
            to={ROUTES.ADMIN_DEPARTMENTS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Building2 size={18} />
            <span>Departments</span>
          </NavLink>
        </>
      );
    }

    if (user.role === Role.ADMIN) {
      return (
        <>
          <div className="nav-section-title">Administration</div>
          <NavLink
            to={ROUTES.ADMIN_DASHBOARD}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={ROUTES.ADMIN_USERS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Users size={18} />
            <span>Users</span>
          </NavLink>
          <NavLink
            to={ROUTES.ADMIN_DEPARTMENTS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Building2 size={18} />
            <span>Departments</span>
          </NavLink>
          <NavLink
            to={ROUTES.ADMIN_JOBS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Briefcase size={18} />
            <span>Job Offers</span>
          </NavLink>
          <NavLink
            to={ROUTES.ADMIN_ANALYTICS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <LineChart size={18} />
            <span>Analytics</span>
          </NavLink>
        </>
      );
    }

    return null;
  };

  return (
    <div className="app-container">
      
      <div
        className={clsx('sidebar-overlay', sidebarOpen && 'open')}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <aside className={clsx('app-sidebar', sidebarOpen && 'open')}>
        <div className="sidebar-header d-flex align-items-center gap-2">
          <div
            className="d-flex align-items-center justify-content-center bg-primary text-white rounded"
            style={{ width: '32px', height: '32px' }}
          >
            <Target size={18} />
          </div>
          <span className="fw-bold fs-6 text-dark">Talent360</span>
        </div>

        <nav className="sidebar-nav">
          {renderNavLinks()}

          <div className="nav-section-title mt-4">Preferences</div>
          <NavLink
            to={ROUTES.SETTINGS}
            onClick={closeSidebar}
            className={({ isActive }) => clsx('nav-item', isActive && 'active')}
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-success rounded-circle"
              style={{ width: '8px', height: '8px' }}
            />
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>
              System Operational
            </span>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <Topbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
