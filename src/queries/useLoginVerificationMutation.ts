import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postLoginVerification, postConfirmLoginVerification } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { pendingLoginStorage } from '@/utils/pendingLoginStorage';
import { saveLoginSession } from '@/utils/loginSession';
import { tokenStorage } from '@/utils/tokenStorage';
import { z } from 'zod';
import { loginVerificationDeliverySchema } from '@/schemas/loginVerificationSchema';

export const LOGIN_CHALLENGE_KEY = ['auth', 'loginChallenge'] as const;
export const LOGIN_DELIVERY_KEY = ['auth', 'loginDelivery'] as const;
export const useLoginDeliveryQuery = () =>
  useQuery<z.infer<typeof loginVerificationDeliverySchema> | null>({
    queryKey: LOGIN_DELIVERY_KEY,
    queryFn: () => null,
    enabled: false,
    gcTime: 0,
  });

export const useLoginChallengeQuery = () =>
  useQuery({
    queryKey: LOGIN_CHALLENGE_KEY,
    queryFn: async () => {
      const challenge = await pendingLoginStorage.get();
      return challenge ? { method: challenge.method, maskedTarget: challenge.maskedTarget } : null;
    },
    staleTime: 0,
    gcTime: 0,
    retry: false,
  });

export function useSendLoginVerificationMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: postLoginVerification,
    retry: false,
    onSuccess: (data) => {
      client.setQueryData(LOGIN_DELIVERY_KEY, data);
    },
  });
}

export function useConfirmLoginVerificationMutation() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (code: string) => {
      const sessionId = tokenStorage.getSessionId();
      const challenge = await pendingLoginStorage.get();
      const result = await postConfirmLoginVerification(code);
      const revision = await saveLoginSession(result, sessionId);
      await pendingLoginStorage.clear();
      return { revision, maskedTarget: challenge?.maskedTarget ?? '' };
    },
    onSuccess: async ({ revision }) => {
      await client.cancelQueries();
      if (revision !== tokenStorage.getRevision()) return;
      client.removeQueries();
      useAuthStore.getState().setLoggedIn(true);
    },
  });
}
