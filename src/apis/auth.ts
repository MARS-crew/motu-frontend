import { api } from '@/apis/instance';
import type { LoginForm } from '@/schemas/authSchema';
import type { ApiResponse } from '@/types/api';
import type { LoginResponse } from '@/types/auth';

export const postLogin = async (body: LoginForm) => {
  const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', body);
  return data.data;
};
