import axios from 'axios';
import { APP_CONFIG } from '@/constants/config';

let inMemoryAccessToken = null;
let inMemoryRefreshToken = null;
let onLogoutCallback = null;

export function setAccessToken(token) {
  inMemoryAccessToken = token;
}

export function getAccessToken() {
  return inMemoryAccessToken;
}

export function setRefreshToken(token) {
  inMemoryRefreshToken = token;
  try {
    if (token) {
      localStorage.setItem('t360_refresh_token', token);
    } else {
      localStorage.removeItem('t360_refresh_token');
    }
  } catch {}
}

export function getRefreshToken() {
  if (inMemoryRefreshToken) return inMemoryRefreshToken;
  try {
    return localStorage.getItem('t360_refresh_token');
  } catch {
    return null;
  }
}

export function setOnLogout(callback) {
  onLogoutCallback = callback;
}

export function clearAuthSession() {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  try {
    localStorage.removeItem('t360_refresh_token');
    localStorage.removeItem('t360_has_session');
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
      originalRequest.url?.includes('/api/auth/refresh')
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
      const response = await axios.post(
        `${APP_CONFIG.API_BASE_URL}/api/auth/refresh`,
        { refreshToken: getRefreshToken() || '' },
        { withCredentials: true }
      );

      const newAccessToken = response.data?.accessToken;
      if (!newAccessToken) {
        throw new Error('Refresh token did not return an access token');
      }

      setAccessToken(newAccessToken);
      if (response.data.refreshToken) {
        setRefreshToken(response.data.refreshToken);
      }

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
