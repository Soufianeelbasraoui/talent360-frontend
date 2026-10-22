import { useContext } from 'react';
import { AuthContext } from '@/app/providers/AuthProvider';

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
