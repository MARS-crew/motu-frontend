import { useEffect, useState } from 'react';

const CODE_VALIDITY_SECONDS = 300;

export function formatEmailCodeTime(seconds: number) {
  return [Math.floor(seconds / 60), seconds % 60]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
}

export function useEmailCodeTimer(resendSeconds: number) {
  const [sentAt, setSentAt] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now);
  const elapsed = sentAt === null ? 0 : Math.max(0, Math.floor((now - sentAt) / 1000));
  const remaining = Math.max(0, CODE_VALIDITY_SECONDS - elapsed);
  const resendRemaining = Math.max(0, resendSeconds - elapsed);
  const hasExpired = sentAt !== null && remaining === 0;

  useEffect(() => {
    if (sentAt === null || hasExpired) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [sentAt, hasExpired]);

  const start = () => {
    const timestamp = Date.now();
    setNow(timestamp);
    setSentAt(timestamp);
  };

  const isCurrent = () => sentAt !== null && Date.now() - sentAt < CODE_VALIDITY_SECONDS * 1000;

  return {
    hasSent: sentAt !== null,
    hasExpired,
    remaining,
    resendRemaining,
    start,
    isCurrent,
    reset: () => setSentAt(null),
  };
}
