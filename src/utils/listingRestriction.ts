import { isAxiosError } from 'axios';
import { z } from 'zod';

import type { MyInfo } from '@/schemas/myInfoSchema';

const ACCOUNT_RESTRICTIONS = {
  LOCKED: { label: '계정 잠금' },
  BLOCKED: { label: '계정 정지' },
} as const;

export function getListingRestriction(status?: MyInfo['userStatus']) {
  return status && status !== 'ACTIVE' ? ACCOUNT_RESTRICTIONS[status] : null;
}

const restrictionErrorSchema = z.object({
  error: z.object({ code: z.enum(['AUTH_ACCOUNT_LOCKED', 'AUTH_ACCOUNT_BLOCKED']) }),
});

// 일반적인 403이나 통신 오류를 계정 제한으로 잘못 안내하지 않습니다.
export function getListingRestrictionFromError(error: unknown) {
  if (!isAxiosError<unknown>(error) || error.response?.status !== 403) return null;
  const parsed = restrictionErrorSchema.safeParse(error.response.data);
  if (!parsed.success) return null;
  return parsed.data.error.code === 'AUTH_ACCOUNT_LOCKED'
    ? ACCOUNT_RESTRICTIONS.LOCKED
    : ACCOUNT_RESTRICTIONS.BLOCKED;
}
