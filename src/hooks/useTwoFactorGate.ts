import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { twoFactorQueryOptions } from '@/queries/useTwoFactorQuery';
import type { TwoFactorIntent } from '@/schemas/twoFactorSessionSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';
import { hasCurrentTwoFactorSession } from '@/utils/twoFactorSession';

export function useTwoFactorGate() {
  const client = useQueryClient();
  const lock = useRef(false);
  const [isChecking, setIsChecking] = useState(false);
  const requireVerification = useCallback(
    async (
      intent: TwoFactorIntent,
      onRedirect?: () => void,
      forceVerification = false,
      allowRegistration = false,
    ) => {
      if (lock.current) return false;
      if (!useAuthStore.getState().isLoggedIn) {
        onRedirect?.();
        router.push({
          pathname: '/login',
          params:
            intent.kind === 'order'
              ? { returnStockId: String(intent.stockId) }
              : intent.kind === 'listing'
                ? { returnTo: '/listing-application' }
                : {},
        });
        return false;
      }
      lock.current = true;
      setIsChecking(true);
      const sessionId = tokenStorage.getSessionId();
      try {
        const status = await client.fetchQuery(twoFactorQueryOptions);
        if (sessionId !== tokenStorage.getSessionId()) return false;
        if (allowRegistration && status.status !== 'ENABLED') return true;
        if (
          !forceVerification &&
          status.status === 'ENABLED' &&
          hasCurrentTwoFactorSession(status.verifiedUntil)
        )
          return true;
        onRedirect?.();
        router.push({
          pathname: status.status === 'ENABLED' ? '/two-factor-session' : '/two-factor-required',
          params: { intent: JSON.stringify(intent) },
        });
        return false;
      } finally {
        lock.current = false;
        setIsChecking(false);
      }
    },
    [client],
  );
  return { requireVerification, isChecking };
}
