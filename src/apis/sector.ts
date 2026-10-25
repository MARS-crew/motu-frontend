import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { Sector } from '@/types/sector';

export const getSectors = async () => {
  const { data } = await api.get<ApiResponse<{ items: Sector[] }>>('/sectors');
  return data.data.items;
};
