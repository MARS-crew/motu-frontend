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

// 토큰은 expo-secure-store 에만 저장합니다.
export const tokenStorage = {
  getAccessToken: () => getItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => getItem(REFRESH_TOKEN_KEY),
  setTokens: async (accessToken: string, refreshToken?: string) => {
    await setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) await setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear: async () => {
    await deleteItem(ACCESS_TOKEN_KEY);
    await deleteItem(REFRESH_TOKEN_KEY);
  },
};
