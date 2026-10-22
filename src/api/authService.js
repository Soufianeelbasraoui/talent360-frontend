import { axiosClient, setAccessToken, setRefreshToken, getRefreshToken, clearAuthSession } from './axiosClient';

/**
 * Service for authentication endpoints.
 */
export const authService = {
  /**
   * Register a new account.
   * @param {import('@/models/user').RegisterRequest} payload
   * @returns {Promise<import('@/models/user').AuthResponse>}
   */
  async register(payload) {
    const response = await axiosClient.post('/api/auth/register', payload);
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      setRefreshToken(response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Log into an existing account.
   * @param {import('@/models/user').LoginRequest} credentials
   * @returns {Promise<import('@/models/user').AuthResponse>}
   */
  async login(credentials) {
    const response = await axiosClient.post('/api/auth/login', credentials);
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      setRefreshToken(response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Manually trigger token refresh.
   * @param {string} [refreshToken]
   * @returns {Promise<import('@/models/user').AuthResponse>}
   */
  async refreshToken(refreshToken) {
    const token = refreshToken || getRefreshToken();
    const response = await axiosClient.post('/api/auth/refresh', {
      refreshToken: token || '',
    });
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      setRefreshToken(response.data.refreshToken);
    }
    return response.data;
  },

  /**
   * Log out user and clear tokens.
   * @returns {Promise<{ message: string }>}
   */
  async logout() {
    try {
      const response = await axiosClient.post('/api/auth/logout');
      return response.data;
    } finally {
      clearAuthSession();
    }
  },
};
