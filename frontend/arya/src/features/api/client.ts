import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/utils/env';
import { tenantConfig } from '@/features/tenant/config';

let authToken = '';

export const setAuthToken = (token: string) => {
  authToken = token;
};

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 12000,
});

apiClient.interceptors.request.use((config) => {
  config.headers.Authorization = authToken ? `Bearer ${authToken}` : undefined;
  config.headers['X-KANOON-SLUG'] = tenantConfig.slug;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    if (status === 401) {
      window.location.href = '/auth/login';
      return Promise.reject(error);
    }
    if (original && !original._retry) {
      original._retry = true;
      return apiClient.request(original);
    }
    return Promise.reject(error);
  },
);

export default apiClient;
