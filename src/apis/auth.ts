import { api } from '@/apis/instance';
import {
  loginResultSchema,
  loginResponseSchema,
  loginSchema,
  type LoginForm,
} from '@/schemas/authSchema';
import { loginVerificationDeliverySchema } from '@/schemas/loginVerificationSchema';
import { newDeviceSchema } from '@/schemas/newDeviceSchema';
import { pendingLoginStorage } from '@/utils/pendingLoginStorage';
import { getDeviceId } from '@/utils/deviceId';
import { Platform } from 'react-native';
import type { ApiResponse } from '@/types/api';

export class LoginVerificationRequiredError extends Error {
  constructor() {
    super('Login verification is required');
    this.name = 'LoginVerificationRequiredError';
  }
}

export const postLogin = async (body: LoginForm) => {
  const deviceId = await getDeviceId();
  const { data } = await api.post<ApiResponse<unknown>>('/auth/login', {
    ...loginSchema.parse(body),
    deviceId,
  });
  const result = loginResultSchema.parse(data.data);
  return result;
};

async function requireLoginToken() {
  const challenge = await pendingLoginStorage.get();
  if (!challenge) throw new LoginVerificationRequiredError();
  return challenge.loginToken;
}

export async function postLoginVerification() {
  const loginToken = await requireLoginToken();
  const { data } = await api.post<ApiResponse<unknown>>('/auth/login/verifications', {
    loginToken,
  });
  return loginVerificationDeliverySchema.parse(data.data);
}

export async function postConfirmLoginVerification(code: string) {
  const loginToken = await requireLoginToken();
  const body = { loginToken, ...newDeviceSchema.parse({ code }) };
  const { data } = await api.post<ApiResponse<unknown>>(
    '/auth/login/verifications/confirm',
    body,
    Platform.OS === 'web' ? undefined : { headers: { 'User-Agent': `MOTU/${Platform.OS}` } },
  );
  return loginResponseSchema.parse(data.data);
}
