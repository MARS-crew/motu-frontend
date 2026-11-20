import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { z } from 'zod';

import { loginVerificationSchema } from '@/schemas/authSchema';

const KEY = 'motu.pendingLogin';
const pendingLoginSchema = loginVerificationSchema.extend({ expiresAt: z.number() });
let memoryValue: string | null = null;

export const pendingLoginStorage = {
  set: async (challenge: z.infer<typeof loginVerificationSchema>) => {
    const value = JSON.stringify({
      ...challenge,
      expiresAt: Date.now() + challenge.loginTokenExpiresIn * 1000,
    });
    if (Platform.OS === 'web') memoryValue = value;
    else await SecureStore.setItemAsync(KEY, value);
  },
  clear: async () => {
    if (Platform.OS === 'web') memoryValue = null;
    else await SecureStore.deleteItemAsync(KEY);
  },
  get: async () => {
    const value = Platform.OS === 'web' ? memoryValue : await SecureStore.getItemAsync(KEY);
    if (!value) return null;
    try {
      const result = pendingLoginSchema.safeParse(JSON.parse(value));
      if (result.success && result.data.expiresAt > Date.now()) return result.data;
    } catch {
      /* 유효한 임시 로그인 토큰만 사용합니다. */
    }
    await pendingLoginStorage.clear();
    return null;
  },
};
