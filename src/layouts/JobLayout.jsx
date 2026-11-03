import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from './AppLayout';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { LandingFooter } from '@/features/landing/components/LandingFooter';

export function JobLayout() {
  const { isAuthenticated } = useAuth();

  // If user is authenticated, keep them in their full workspace with sidebar and topbar
  if (isAuthenticated) {
    return <AppLayout />;
  }

  // If visitor is not authenticated, render the clean full-width public SaaS layout
  return (
    <div className="landing-page min-vh-100 d-flex flex-column bg-light">
      <LandingNavbar />
      <main className="flex-grow-1 py-4 py-md-5">
        <div className="container-xl">
          <Outlet />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

