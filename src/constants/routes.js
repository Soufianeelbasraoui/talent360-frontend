
export const ROUTES = Object.freeze({
  ROOT: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  CANDIDATE_DASHBOARD: '/candidate/dashboard',
  CANDIDATE_PROFILE: '/candidate/profile',
  CANDIDATE_CV: '/candidate/cv',
  CANDIDATE_APPLICATIONS: '/candidate/applications',
  JOBS: '/jobs',
  JOB_DETAIL: '/jobs/:id',

  RECRUITER_DASHBOARD: '/recruiter/dashboard',
  RECRUITER_JOBS: '/recruiter/jobs',
  RECRUITER_JOB_NEW: '/recruiter/jobs/new',
  RECRUITER_APPLICATIONS: '/recruiter/jobs/:id/applications',
  RECRUITER_RANKING: '/recruiter/jobs/:id/ranking',
  RECRUITER_CANDIDATE_VIEW: '/recruiter/candidates/:id',

  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_DEPARTMENTS: '/admin/departments',
  ADMIN_JOBS: '/admin/jobs',
  ADMIN_APPLICATIONS: '/admin/applications',
  ADMIN_ANALYTICS: '/admin/analytics',

  SETTINGS: '/settings',
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
});
