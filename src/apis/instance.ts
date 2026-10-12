import { create, isAxiosError } from 'axios';

import { API_URL } from '@/constants/env';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export const api = create({
  baseURL: API_URL,
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  const accessToken = await tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      // TODO: 토큰 재발급 API 확정 후 refresh 로직 추가
      await tokenStorage.clear();
      useAuthStore.getState().setLoggedIn(false);
    }
    return Promise.reject(error);
  },
);
