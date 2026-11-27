import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postConfirmTwoFactorVerification, postTwoFactorVerification } from '@/apis/twoFactor';
import { SessionChangedError } from '@/apis/instance';
import { twoFactorQueryOptions } from '@/queries/useTwoFactorQuery';
import type { TwoFactorCodeForm } from '@/schemas/twoFactorSessionSchema';
import { tokenStorage } from '@/utils/tokenStorage';

export const getTwoFactorDeliveryKey = (sessionId: number) =>
  ['two-factor', 'delivery', sessionId] as const;

export function useSendTwoFactorSessionMutation() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async () => {
      const sessionId = tokenStorage.getSessionId();
      const result = await postTwoFactorVerification();
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      client.setQueryData(getTwoFactorDeliveryKey(sessionId), result);
      return result;
    },
  });
}
export function useConfirmTwoFactorSessionMutation() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (body: TwoFactorCodeForm) => {
      const sessionId = tokenStorage.getSessionId();
      const result = await postConfirmTwoFactorVerification(body);
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      await client.invalidateQueries({ queryKey: twoFactorQueryOptions.queryKey });
      return result;
    },
  });
}
