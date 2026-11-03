import axios from 'axios';
import { APP_CONFIG } from '@/constants/config';

let inMemoryAccessToken = null;
let onLogoutCallback = null;

export function setAccessToken(token) {
  inMemoryAccessToken = token;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

export function setOnLogout(callback) {
  onLogoutCallback = callback;
}

export function clearAuthSession() {
  inMemoryAccessToken = null;
  // Ensure no tokens remain in any client-side storage
  try {
    localStorage.removeItem('t360_refresh_token');
    sessionStorage.removeItem('t360_refresh_token');
    localStorage.removeItem('t360_has_session');
    sessionStorage.removeItem('t360_has_session');
    localStorage.removeItem('t360_candidate_id');
  } catch {}

  if (typeof onLogoutCallback === 'function') {
    onLogoutCallback();
  }
}

export const axiosClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Attach in-memory access token to outgoing requests
axiosClient.interceptors.request.use(
  config => {
    if (inMemoryAccessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Handle automatic token refresh when HTTP 401 is received
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      !error.response ||
      error.response.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes('/api/auth/login') ||
      originalRequest.url?.includes('/api/auth/register') ||
      originalRequest.url?.includes('/api/auth/refresh') ||
      originalRequest.url?.includes('/api/auth/logout')
    ) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosClient(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // The browser automatically sends the HttpOnly refreshToken cookie with withCredentials: true
      const response = await axios.post(
        `${APP_CONFIG.API_BASE_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('Refresh token did not return an access token');
      }

      setAccessToken(newAccessToken);
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearAuthSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
