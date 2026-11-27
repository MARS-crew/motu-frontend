import { useEffect, useState } from 'react';

type VerificationDeadline = { expiresAt: string; resendAvailableAt: string };

export function getVerificationTime(deadline: VerificationDeadline | undefined, now = Date.now()) {
  const remaining = deadline
    ? Math.max(0, Math.ceil((Date.parse(deadline.expiresAt) - now) / 1000))
    : 0;
  const resendRemaining = deadline
    ? Math.max(0, Math.ceil((Date.parse(deadline.resendAvailableAt) - now) / 1000))
    : 0;
  return { remaining, resendRemaining, hasExpired: Boolean(deadline) && remaining === 0 };
}

export function useVerificationTimer(deadline?: VerificationDeadline) {
  const [, setNow] = useState(Date.now);
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [deadline]);
  // 응답을 기다린 시간 때문에 첫 프레임의 남은 시간이 늘어나지 않도록 현재 시각으로 계산합니다.
  return getVerificationTime(deadline);
}
