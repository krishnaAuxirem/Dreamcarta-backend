import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { clearSession, emitUnauthorized, getAuthToken } from '@/lib/auth/session';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const MAX_GET_RETRIES = 2;
const RETRY_DELAY_MS = 350;

type RetriableConfig = AxiosRequestConfig & {
  __retryCount?: number;
  __noRetry?: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetryGetRequest = (error: AxiosError): boolean => {
  if (error.code === 'ERR_CANCELED' || axios.isCancel(error)) {
    return false;
  }

  if ((error?.config as RetriableConfig | undefined)?.__noRetry) {
    return false;
  }

  const method = String(error?.config?.method || '').toUpperCase();
  if (method !== 'GET') {
    return false;
  }

  const status = error?.response?.status;
  if (status === 401) {
    return false;
  }

  // Retry GET on transient network/server failures only.
  return !status || status >= 500;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || getAuthToken();
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error?.response?.status === 401) {
      clearSession();
      emitUnauthorized();
    }

    if (shouldRetryGetRequest(error)) {
      const config: RetriableConfig = (error?.config || {}) as RetriableConfig;
      const retryCount = config.__retryCount ?? 0;

      if (retryCount < MAX_GET_RETRIES) {
        config.__retryCount = retryCount + 1;
        await sleep(RETRY_DELAY_MS * config.__retryCount);
        return apiClient.request(config);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
