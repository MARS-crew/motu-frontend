import { api } from '@/apis/instance';
import { myInfoSchema } from '@/schemas/myInfoSchema';
import type { ApiResponse } from '@/types/api';

export const getMyInfo = async (signal?: AbortSignal) => {
  const { data } = await api.get<ApiResponse<unknown>>('/users/me', { signal });
  return myInfoSchema.parse(data.data);
};
