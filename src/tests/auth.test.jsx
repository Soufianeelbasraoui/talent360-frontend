import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { ToastProvider } from '@/app/providers/ToastProvider';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import {
  setAccessToken,
  getAccessToken,
  clearAuthSession,
} from '@/api/axiosClient';

describe('Auth Flow & Interceptors', () => {
  beforeEach(() => {
    clearAuthSession();
  });

  it('keeps access token in memory and clears it on logout', () => {
    expect(getAccessToken()).toBeNull();
    setAccessToken('test-in-memory-token');
    expect(getAccessToken()).toBe('test-in-memory-token');
    clearAuthSession();
    expect(getAccessToken()).toBeNull();
  });

  it('renders login form elements with accessible inputs', () => {
    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('validates email and password on submit', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ToastProvider>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </ToastProvider>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /continue/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/email address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
