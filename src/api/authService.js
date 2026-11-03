import { axiosClient, setAccessToken, clearAuthSession } from './axiosClient';

export const authService = {
  async register(payload) {
    const response = await axiosClient.post('/api/auth/register', payload);
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  async login(credentials) {
    const response = await axiosClient.post('/api/auth/login', credentials);
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response.data;
  },

  async refreshToken() {
    // Refresh token is stored in an HttpOnly cookie and sent automatically by the browser
    const response = await axiosClient.post('/api/auth/refresh', {});
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
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
