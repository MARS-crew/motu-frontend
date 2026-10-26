import { api } from '@/apis/instance';
import { pointResetResultSchema, pointResetStatusSchema } from '@/schemas/pointResetSchema';
import { unwrapPointResponse } from '@/utils/pointResponse';

export const getPointResetStatus = async (signal?: AbortSignal) => {
  const { data } = await api.get<unknown>('/accounts/me/point-reset', { signal });
  return pointResetStatusSchema.parse(unwrapPointResponse(data));
};

export const postPointReset = async () => {
  const { data } = await api.post<unknown>('/accounts/me/point-reset');
  return pointResetResultSchema.parse(unwrapPointResponse(data));
};
