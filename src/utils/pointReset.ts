import { isAxiosError } from 'axios';
import { z } from 'zod';

import { pointResetConditionSchema, type PointResetStatus } from '@/schemas/pointResetSchema';
import { getPointRequestErrorMessage } from '@/utils/pointResponse';

export function getPointResetStatusReason(status: PointResetStatus) {
  if (status.available && status.conditions.every((condition) => condition.met)) return null;
  return (
    status.reason?.trim() ||
    status.conditions.find((condition) => !condition.met && condition.message?.trim())?.message ||
    '현재 포인트 리셋 조건을 충족하지 않습니다.'
  );
}

const resetErrorSchema = z.object({
  details: z.object({ conditions: z.array(pointResetConditionSchema) }),
});

export function getPointResetRequestErrorMessage(error: unknown) {
  if (isAxiosError<unknown>(error) && error.response?.status === 409) {
    const data = error.response.data;
    const body = resetErrorSchema.safeParse(
      data && typeof data === 'object' && 'error' in data ? data.error : data,
    );
    const reason = body.success
      ? body.data.details.conditions.find(
          (condition) => !condition.met && condition.message?.trim(),
        )?.message
      : null;
    if (reason) return reason;
  }
  return getPointRequestErrorMessage(
    error,
    '포인트 리셋 결과를 확인하지 못했습니다. 최신 리셋 정보를 확인해 주세요.',
  );
}
