import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { authService } from '@/api/authService';
import { candidateService } from '@/api/candidateService';
import { setOnLogout, getAccessToken } from '@/api/axiosClient';
import { Role } from '@/constants/enums';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      try { localStorage.removeItem('t360_has_session'); } catch {}
      setUser(null);
      setCandidateProfile(null);
    }
  }, []);

  const loadCandidateProfile = useCallback(async () => {
    try {
      const profile = await candidateService.getCandidate('me');
      setCandidateProfile(profile);
      return profile;
    } catch {
      return null;
    }
  }, []);

  const handleAuthSuccess = useCallback(async (authData) => {
    const userInfo = {
      id: authData.userId,
      email: authData.email,
      role: authData.role,
    };
    try { localStorage.setItem('t360_has_session', '1'); } catch {}
    setUser(userInfo);

    if (authData.role === Role.CANDIDATE) {
      await loadCandidateProfile();
    }
  }, [loadCandidateProfile]);

  useEffect(() => {
    let isMounted = true;

    setOnLogout(() => {
      if (isMounted) {
        setUser(null);
        setCandidateProfile(null);
      }
    });

    const initAuth = async () => {
      let hasPriorSession = false;
      try { hasPriorSession = localStorage.getItem('t360_has_session') === '1'; } catch {}
      if (!hasPriorSession) {
        if (isMounted) setIsLoading(false);
        return;
      }
      try {
        const refreshRes = await authService.refreshToken();
        if (refreshRes && isMounted) {
          const userInfo = {
            id: refreshRes.userId,
            email: refreshRes.email,
            role: refreshRes.role,
          };
          setUser(userInfo);
          if (refreshRes.role === Role.CANDIDATE) {
            try {
              const profile = await candidateService.getCandidate('me');
              if (isMounted) setCandidateProfile(profile);
            } catch {
            }
          }
        }
      } catch {
        if (isMounted) {
          setUser(null);
          setCandidateProfile(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);
      await handleAuthSuccess(data);
      return data;
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      await handleAuthSuccess(data);
      return data;
    },
    [handleAuthSuccess]
  );

  const refreshProfile = useCallback(async () => {
    if (user?.role === Role.CANDIDATE) {
      await loadCandidateProfile();
    }
  }, [user?.role, loadCandidateProfile]);

  const value = useMemo(
    () => ({
      user,
      candidateProfile,
      isAuthenticated: Boolean(user && getAccessToken()),
      isLoading,
      login,
      register,
      logout,
      refreshProfile,
    }),
    [user, candidateProfile, isLoading, login, register, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
