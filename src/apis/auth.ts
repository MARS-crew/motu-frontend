import { api } from '@/apis/instance';
import type { LoginForm } from '@/schemas/authSchema';
import type { TokenResponse } from '@/types/auth';

export const postLogin = async (body: LoginForm) => {
  const { data } = await api.post<TokenResponse>('/auth/login', body);
  return data;
};
