import { axiosClient, setAccessToken, setRefreshToken, getRefreshToken, clearAuthSession } from './axiosClient';

export const authService = {
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

  async logout() {
    try {
      const response = await axiosClient.post('/api/auth/logout');
      return response.data;
    } finally {
      clearAuthSession();
    }
  },
};
