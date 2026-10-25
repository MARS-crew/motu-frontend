import { api } from '@/apis/instance';
import type { Account } from '@/types/account';
import type { ApiResponse } from '@/types/api';

export const getMyAccount = async () => {
  const { data } = await api.get<ApiResponse<Account>>('/accounts/me');
  return data.data;
};
