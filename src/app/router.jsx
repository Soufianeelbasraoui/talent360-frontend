import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { AppLayout } from '@/layouts/AppLayout';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { ROUTES } from '@/constants/routes';
import { Role } from '@/constants/enums';
import { Skeleton } from '@/components/Skeleton';
import { useAuth } from '@/hooks/useAuth';

function PageLoader() {
  return (
    <div className="p-4 w-100">
      <Skeleton count={4} height={45} className="mb-3" />
    </div>
  );
}

function RootRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <PageLoader />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />;

  if (user.role === Role.ADMIN) return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
  if (user.role === Role.RECRUITER) return <Navigate to={ROUTES.RECRUITER_DASHBOARD} replace />;
  return <Navigate to={ROUTES.CANDIDATE_DASHBOARD} replace />;
}

const LoginPage = lazy(() =>
  import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then(m => ({ default: m.RegisterPage }))
);

const CandidateDashboardPage = lazy(() =>
  import('@/features/dashboard/candidate/CandidateDashboardPage').then(m => ({
    default: m.CandidateDashboardPage,
  }))
);
const CandidateProfilePage = lazy(() =>
  import('@/features/candidate/profile/CandidateProfilePage').then(m => ({
    default: m.CandidateProfilePage,
  }))
);
const CvUploadPage = lazy(() =>
  import('@/features/candidate/cv-upload/CvUploadPage').then(m => ({ default: m.CvUploadPage }))
);
const JobListPage = lazy(() =>
  import('@/features/jobs/list/JobListPage').then(m => ({ default: m.JobListPage }))
);
const JobDetailPage = lazy(() =>
  import('@/features/jobs/detail/JobDetailPage').then(m => ({ default: m.JobDetailPage }))
);
const MyApplicationsPage = lazy(() =>
  import('@/features/candidate/applications/MyApplicationsPage').then(m => ({
    default: m.MyApplicationsPage,
  }))
);

const RecruiterDashboardPage = lazy(() =>
  import('@/features/dashboard/recruiter/RecruiterDashboardPage').then(m => ({
    default: m.RecruiterDashboardPage,
  }))
);
const JobCreatePage = lazy(() =>
  import('@/features/jobs/jd-generator/JobCreatePage').then(m => ({ default: m.JobCreatePage }))
);
const JobManagePage = lazy(() =>
  import('@/features/jobs/manage/JobManagePage').then(m => ({ default: m.JobManagePage }))
);
const ApplicationsKanbanPage = lazy(() =>
  import('@/features/applications/kanban/ApplicationsKanbanPage').then(m => ({
    default: m.ApplicationsKanbanPage,
  }))
);
const CandidateRankingPage = lazy(() =>
  import('@/features/applications/ranking/CandidateRankingPage').then(m => ({
    default: m.CandidateRankingPage,
  }))
);
const CandidateProfileViewPage = lazy(() =>
  import('@/features/applications/candidate-profile-view/CandidateProfileViewPage').then(m => ({
    default: m.CandidateProfileViewPage,
  }))
);

const AdminDashboardPage = lazy(() =>
  import('@/features/dashboard/admin/AdminDashboardPage').then(m => ({
    default: m.AdminDashboardPage,
  }))
);
const AdminUsersPage = lazy(() =>
  import('@/features/admin/users/AdminUsersPage').then(m => ({ default: m.AdminUsersPage }))
);
const AdminDepartmentsPage = lazy(() =>
  import('@/features/admin/departments/AdminDepartmentsPage').then(m => ({
    default: m.AdminDepartmentsPage,
  }))
);

const SettingsPage = lazy(() =>
  import('@/features/settings/SettingsPage').then(m => ({ default: m.SettingsPage }))
);
const ForbiddenPage = lazy(() =>
  import('@/features/shared/ForbiddenPage').then(m => ({ default: m.ForbiddenPage }))
);
const NotFoundPage = lazy(() =>
  import('@/features/shared/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
);

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <RootRedirect />,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: ROUTES.LOGIN,
        element: (
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.REGISTER,
        element: (
          <Suspense fallback={<PageLoader />}>
            <RegisterPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.CANDIDATE_DASHBOARD,
        element: (
          <RoleRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}>
              <CandidateDashboardPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.CANDIDATE_PROFILE,
        element: (
          <RoleRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}>
              <CandidateProfilePage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.CANDIDATE_CV,
        element: (
          <RoleRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}>
              <CvUploadPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.CANDIDATE_APPLICATIONS,
        element: (
          <RoleRoute allowedRoles={[Role.CANDIDATE]}>
            <Suspense fallback={<PageLoader />}>
              <MyApplicationsPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.JOBS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <JobListPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.JOB_DETAIL,
        element: (
          <Suspense fallback={<PageLoader />}>
            <JobDetailPage />
          </Suspense>
        ),
      },

      {
        path: ROUTES.RECRUITER_DASHBOARD,
        element: (
          <RoleRoute allowedRoles={[Role.RECRUITER]}>
            <Suspense fallback={<PageLoader />}>
              <RecruiterDashboardPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.RECRUITER_JOBS,
        element: (
          <RoleRoute allowedRoles={[Role.RECRUITER, Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <JobManagePage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.RECRUITER_JOB_NEW,
        element: (
          <RoleRoute allowedRoles={[Role.RECRUITER]}>
            <Suspense fallback={<PageLoader />}>
              <JobCreatePage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.RECRUITER_APPLICATIONS,
        element: (
          <RoleRoute allowedRoles={[Role.RECRUITER, Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <ApplicationsKanbanPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.RECRUITER_RANKING,
        element: (
          <RoleRoute allowedRoles={[Role.RECRUITER, Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <CandidateRankingPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.RECRUITER_CANDIDATE_VIEW,
        element: (
          <RoleRoute allowedRoles={[Role.RECRUITER, Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <CandidateProfileViewPage />
            </Suspense>
          </RoleRoute>
        ),
      },

      {
        path: ROUTES.ADMIN_DASHBOARD,
        element: (
          <RoleRoute allowedRoles={[Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboardPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_USERS,
        element: (
          <RoleRoute allowedRoles={[Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <AdminUsersPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_DEPARTMENTS,
        element: (
          <RoleRoute allowedRoles={[Role.ADMIN, Role.RECRUITER]}>
            <Suspense fallback={<PageLoader />}>
              <AdminDepartmentsPage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_JOBS,
        element: (
          <RoleRoute allowedRoles={[Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <JobManagePage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_APPLICATIONS,
        element: (
          <RoleRoute allowedRoles={[Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <JobManagePage />
            </Suspense>
          </RoleRoute>
        ),
      },
      {
        path: ROUTES.ADMIN_ANALYTICS,
        element: (
          <RoleRoute allowedRoles={[Role.ADMIN]}>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboardPage />
            </Suspense>
          </RoleRoute>
        ),
      },

      {
        path: ROUTES.SETTINGS,
        element: (
          <Suspense fallback={<PageLoader />}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTES.FORBIDDEN,
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForbiddenPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
  },
});
