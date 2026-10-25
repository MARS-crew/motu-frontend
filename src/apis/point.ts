import { api } from '@/apis/instance';
import { pointGrantStatusSchema } from '@/schemas/pointGrantSchema';

export const getPointGrantStatus = async (signal?: AbortSignal) => {
  const { data } = await api.get<unknown>('/api/accounts/me/point-grant', { signal });
  return pointGrantStatusSchema.parse(data);
};
