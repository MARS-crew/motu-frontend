import { api } from '@/apis/instance';
import { pointGrantResultSchema, pointGrantStatusSchema } from '@/schemas/pointGrantSchema';

import { unwrapPointResponse } from '@/utils/pointResponse';

export const getPointGrantStatus = async (signal?: AbortSignal) => {
  const { data } = await api.get<unknown>('/accounts/me/point-grant', { signal });
  return pointGrantStatusSchema.parse(unwrapPointResponse(data));
};

export const postPointGrant = async () => {
  const { data } = await api.post<unknown>('/accounts/me/point-grant');
  return pointGrantResultSchema.parse(unwrapPointResponse(data));
};
