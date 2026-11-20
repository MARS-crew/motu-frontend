import { api } from '@/apis/instance';
import { loginResultSchema, loginSchema, type LoginForm } from '@/schemas/authSchema';
import type { ApiResponse } from '@/types/api';

export class LoginVerificationRequiredError extends Error {
  constructor() {
    super('Login verification is required');
    this.name = 'LoginVerificationRequiredError';
  }
}

export const postLogin = async (body: LoginForm) => {
  // 기본 로그인 단계만 연결합니다. 기기 인증용 deviceId/loginToken은 사용하지 않습니다.
  const { data } = await api.post<ApiResponse<unknown>>('/auth/login', loginSchema.parse(body));
  const result = loginResultSchema.parse(data.data);
  if (result.verificationRequired) throw new LoginVerificationRequiredError();
  return result;
};
