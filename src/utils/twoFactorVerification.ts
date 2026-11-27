import type { TwoFactorDelivery } from '@/schemas/twoFactorSessionSchema';
import type { TwoFactor } from '@/schemas/twoFactorSchema';
import { getTwoFactorSecondsUntil } from '@/utils/twoFactorSession';

type TwoFactorVerificationStateInput = {
  status?: TwoFactor;
  delivery?: TwoFactorDelivery;
  statusUpdatedAt: number;
  deliveryUpdatedAt: number;
  isStatusSuccess: boolean;
  isStatusFetching: boolean;
  hasFailedAttempt: boolean;
  failure: 'mismatch' | 'expired' | 'locked' | null;
};

// 횟수와 제한 시각은 서버 응답만 사용합니다. 로컬에서 차감하거나 30분을 만들어 넣지 않습니다.
export function getTwoFactorVerificationState(
  input: TwoFactorVerificationStateInput,
  now = Date.now(),
) {
  const { status, delivery, failure } = input;
  const remaining = getTwoFactorSecondsUntil(delivery?.expiresAt, now);
  const resendRemaining = getTwoFactorSecondsUntil(delivery?.resendAvailableAt, now);
  const hasFreshDelivery = delivery && input.deliveryUpdatedAt >= input.statusUpdatedAt;
  const remainingAttempts =
    input.hasFailedAttempt && (!input.isStatusSuccess || input.isStatusFetching)
      ? undefined
      : hasFreshDelivery
        ? delivery.remainingAttempts
        : (status?.remainingAttempts ?? delivery?.remainingAttempts);
  return {
    remaining,
    resendRemaining,
    remainingAttempts,
    isExpired: failure === 'expired' || Boolean(delivery && remaining === 0),
    // 제한 응답 뒤 상태 재조회가 실패한 경우는 계속 차단합니다. 재조회가 성공하면 서버 시각을 따릅니다.
    isLocked:
      Boolean(status?.lockedUntil && Date.parse(status.lockedUntil) > now) ||
      (failure === 'locked' && (!input.isStatusSuccess || input.isStatusFetching)),
  };
}
