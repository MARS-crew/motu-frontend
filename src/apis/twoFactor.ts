import { api } from '@/apis/instance';
import { twoFactorSchema } from '@/schemas/twoFactorSchema';
import type { ApiResponse } from '@/types/api';

export async function getTwoFactor(signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<unknown>>('/two-factor', { signal });
  return twoFactorSchema.parse(data.data);
}
