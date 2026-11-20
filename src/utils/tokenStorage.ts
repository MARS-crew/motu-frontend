import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@/constants/storageKeys';

// expo-secure-store는 웹을 지원하지 않습니다.
// 웹(개발 확인용)에서는 토큰을 브라우저 저장소에 두지 않고 메모리에만 보관합니다. (새로고침 시 로그아웃)
const memoryTokens = new Map<string, string>();
const isWeb = Platform.OS === 'web';

const getItem = async (key: string) =>
  isWeb ? (memoryTokens.get(key) ?? null) : SecureStore.getItemAsync(key);

const setItem = async (key: string, value: string) => {
  if (isWeb) {
    memoryTokens.set(key, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
};

const deleteItem = async (key: string) => {
  if (isWeb) {
    memoryTokens.delete(key);
    return;
  }
  await SecureStore.deleteItemAsync(key);
};

// 토큰 교체·삭제를 직렬화하여 이전 요청이 새 세션을 덮어쓰지 않게 합니다.
let revision = 0;
let sessionId = 0;
let mutation: Promise<void> = Promise.resolve();
const mutateTokens = (operation: () => Promise<void>) => {
  revision += 1;
  const next = mutation.then(operation, operation);
  mutation = next.catch(() => undefined);
  return next;
};
const clearItems = async () => {
  await Promise.all([deleteItem(ACCESS_TOKEN_KEY), deleteItem(REFRESH_TOKEN_KEY)]);
};

const persistTokens = (accessToken: string, refreshToken?: string) =>
  mutateTokens(async () => {
    try {
      if (refreshToken) await setItem(REFRESH_TOKEN_KEY, refreshToken);
      else await deleteItem(REFRESH_TOKEN_KEY);
      await setItem(ACCESS_TOKEN_KEY, accessToken);
    } catch (error) {
      await Promise.allSettled([deleteItem(ACCESS_TOKEN_KEY), deleteItem(REFRESH_TOKEN_KEY)]);
      throw error;
    }
  });

export const tokenStorage = {
  getRevision: () => revision,
  getSessionId: () => sessionId,
  getAccessToken: async () => {
    await mutation;
    return getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken: async () => {
    await mutation;
    return getItem(REFRESH_TOKEN_KEY);
  },
  setTokens: (accessToken: string, refreshToken?: string) => {
    sessionId += 1;
    return persistTokens(accessToken, refreshToken);
  },
  // 같은 로그인 세션 안에서 토큰만 교체합니다.
  rotateTokens: persistTokens,
  clear: () => {
    sessionId += 1;
    return mutateTokens(clearItems);
  },
};
