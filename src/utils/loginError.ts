import { isAxiosError } from 'axios';

import { loginFailureSchema } from '@/schemas/authSchema';

export function getLoginFailure(error: unknown) {
  if (!isAxiosError(error) || error.response?.status !== 401) return null;
  const result = loginFailureSchema.safeParse(error.response.data);
  if (!result.success) return null;
  return {
    message: '아이디 또는 비밀번호를 확인해 주세요.',
    failCount: result.data.error.details?.failCount ?? null,
  };
}
