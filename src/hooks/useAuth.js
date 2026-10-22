import { useContext } from 'react';
import { AuthContext } from '@/app/providers/AuthProvider';

/**
 * Hook to access current authentication state and actions.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      candidateProfile: null,
      isAuthenticated: false,
      isLoading: false,
      login: async () => {},
      register: async () => {},
      logout: async () => {},
      refreshProfile: async () => {},
    };
  }
  return context;
}
