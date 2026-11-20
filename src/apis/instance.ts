import { create, isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { ZodError } from 'zod';

import { API_URL } from '@/constants/env';
import { sessionTokensSchema, type SessionTokens } from '@/schemas/authSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import type { ApiErrorResponse, ApiResponse } from '@/types/api';
import { tokenStorage } from '@/utils/tokenStorage';

type AuthRequestConfig = InternalAxiosRequestConfig & {
  hasRetriedAuth?: boolean;
  authSessionId?: number;
};
type RefreshedSession = SessionTokens & { sessionRevision: number };

const isTokenEndpoint = (url?: string) =>
  url === '/auth/login' ||
  url === '/auth/refresh' ||
  url?.startsWith('/auth/login/verifications') === true;
export const api = create({ baseURL: API_URL, timeout: 10_000 });

export class SessionChangedError extends Error {
  constructor() {
    super('Session changed while the request was pending');
    this.name = 'SessionChangedError';
  }
}

export async function clearAuthSession() {
  useAuthStore.getState().setLoggedIn(false);
  await tokenStorage.clear();
}

let refreshing: { sessionId: number; promise: Promise<RefreshedSession> } | null = null;

// 토큰 재발급도 같은 Axios 인스턴스를 사용하되 인증 인터셉터의 재시도 대상에서 제외합니다.
export function refreshSession(): Promise<RefreshedSession> {
  const sessionId = tokenStorage.getSessionId();
  if (refreshing?.sessionId === sessionId) return refreshing.promise;
  const promise = (async () => {
    const revision = tokenStorage.getRevision();
    const refreshToken = await tokenStorage.getRefreshToken();
    if (revision !== tokenStorage.getRevision()) throw new SessionChangedError();
    if (!refreshToken) {
      await clearAuthSession();
      throw new SessionChangedError();
    }
    let persistenceRevision: number | null = null;
    try {
      const { data } = await api.post<ApiResponse<unknown>>('/auth/refresh', { refreshToken });
      const tokens = sessionTokensSchema.parse(data.data);
      if (revision !== tokenStorage.getRevision()) throw new SessionChangedError();
      const persistence = tokenStorage.rotateTokens(tokens.accessToken, tokens.refreshToken);
      const sessionRevision = tokenStorage.getRevision();
      persistenceRevision = sessionRevision;
      await persistence;
      if (sessionRevision !== tokenStorage.getRevision()) throw new SessionChangedError();
      return { ...tokens, sessionRevision };
    } catch (error) {
      // 통신 장애는 토큰을 폐기하지 않습니다. 서버가 인증을 거절한 경우에만 세션을 종료합니다.
      if (
        sessionId === tokenStorage.getSessionId() &&
        (revision === tokenStorage.getRevision() ||
          persistenceRevision === tokenStorage.getRevision()) &&
        ((isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)) ||
          error instanceof ZodError ||
          persistenceRevision !== null)
      ) {
        await clearAuthSession();
      }
      throw error;
    }
  })().finally(() => {
    if (refreshing?.promise === promise) refreshing = null;
  });
  refreshing = { sessionId, promise };
  return promise;
}

api.interceptors.request.use(async (config) => {
  if (isTokenEndpoint(config.url)) {
    config.headers.delete('Authorization');
    return config;
  }
  const request = config as AuthRequestConfig;
  request.authSessionId ??= tokenStorage.getSessionId();
  const accessToken = await tokenStorage.getAccessToken();
  if (request.authSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
  if (accessToken) config.headers.set('Authorization', `Bearer ${accessToken}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError<ApiErrorResponse>(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }
    const config = error.config as AuthRequestConfig;
    // 로그인 실패는 기존 세션을 지우거나 자동 재시도하지 않습니다.
    if (isTokenEndpoint(config.url)) return Promise.reject(error);
    if (config.authSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
    const errorCode: unknown = error.response.data?.error?.code;
    const rejectedToken = config.headers.get('Authorization');
    const currentToken = await tokenStorage.getAccessToken();
    if (config.authSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
    // 이전 세션에서 늦게 도착한 401이 새로 로그인한 세션을 지우지 않게 합니다.
    if (currentToken && rejectedToken !== `Bearer ${currentToken}`) {
      if (config.hasRetriedAuth) return Promise.reject(error);
      config.hasRetriedAuth = true;
      return api.request(config);
    }
    if (config.hasRetriedAuth || errorCode !== 'AUTH_TOKEN_EXPIRED') {
      await clearAuthSession();
      return Promise.reject(error);
    }
    config.hasRetriedAuth = true;
    const session = await refreshSession();
    if (session.sessionRevision !== tokenStorage.getRevision()) throw new SessionChangedError();
    config.headers.set('Authorization', `Bearer ${session.accessToken}`);
    return api.request(config);
  },
);
