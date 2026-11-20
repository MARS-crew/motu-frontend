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
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    if (!deadline) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [deadline]);
  return getVerificationTime(deadline, now);
}
