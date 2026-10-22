import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthContext } from '@/app/providers/AuthProvider';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { RoleRoute } from '@/routes/RoleRoute';
import { Role } from '@/constants/enums';

describe('Route Guards', () => {
  it('redirects unauthenticated user to /login', () => {
    const mockAuth = {
      user: null,
      isLoading: false,
      isAuthenticated: false,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/candidate/dashboard']}>
          <Routes>
            <Route path="/login" element={<div>Login Page</div>} />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Candidate Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Candidate Content')).not.toBeInTheDocument();
  });

  it('allows access to protected content when authenticated', () => {
    const mockAuth = {
      user: { id: 1, email: 'candidate@example.com', role: Role.CANDIDATE },
      isLoading: false,
      isAuthenticated: true,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/candidate/dashboard']}>
          <Routes>
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute>
                  <div>Protected Candidate Content</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Candidate Content')).toBeInTheDocument();
  });

  it('redirects unauthorized role to 403 Forbidden', () => {
    const mockAuth = {
      user: { id: 1, email: 'candidate@example.com', role: Role.CANDIDATE },
      isLoading: false,
      isAuthenticated: true,
    };

    render(
      <AuthContext.Provider value={mockAuth}>
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route path="/403" element={<div>Access Forbidden 403</div>} />
            <Route
              path="/admin/users"
              element={
                <RoleRoute allowedRoles={[Role.ADMIN]}>
                  <div>Admin Users Table</div>
                </RoleRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Access Forbidden 403')).toBeInTheDocument();
    expect(screen.queryByText('Admin Users Table')).not.toBeInTheDocument();
  });
});
