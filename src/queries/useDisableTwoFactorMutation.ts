import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postDisableTwoFactor } from '@/apis/twoFactor';
import { SessionChangedError } from '@/apis/instance';
import { twoFactorQueryOptions } from '@/queries/useTwoFactorQuery';
import { myInfoQueryOptions } from '@/queries/useMyInfoQuery';
import { tokenStorage } from '@/utils/tokenStorage';

export function useDisableTwoFactorMutation() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async () => {
      const sessionId = tokenStorage.getSessionId();
      const result = await postDisableTwoFactor();
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      await client.cancelQueries({ queryKey: twoFactorQueryOptions.queryKey });
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      client.setQueryData(twoFactorQueryOptions.queryKey, result);
      client.removeQueries({ queryKey: ['two-factor', 'delivery'] });
      await client.invalidateQueries({ queryKey: myInfoQueryOptions.queryKey });
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      return result;
    },
  });
}
