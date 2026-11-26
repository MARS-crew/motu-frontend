import { useMutation, useQuery, useQueryClient, skipToken } from '@tanstack/react-query';
import {
  postTwoFactorPhoneVerification,
  postConfirmTwoFactorPhoneVerification,
} from '@/apis/twoFactor';
import { SessionChangedError } from '@/apis/instance';
import { twoFactorQueryOptions } from '@/queries/useTwoFactorQuery';
import { myInfoQueryOptions } from '@/queries/useMyInfoQuery';
import type { SecondFactorForm } from '@/schemas/secondFactorSchema';
import { tokenStorage } from '@/utils/tokenStorage';

const getDeliveryKey = () => ['two-factor', 'registration', tokenStorage.getSessionId()] as const;
export function useTwoFactorRegistrationDeliveryQuery() {
  return useQuery<Awaited<ReturnType<typeof postTwoFactorPhoneVerification>>>({
    queryKey: getDeliveryKey(),
    queryFn: skipToken,
    gcTime: 0,
  });
}
export function useSendTwoFactorRegistrationMutation() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (phone: string) => {
      const sessionId = tokenStorage.getSessionId();
      const result = await postTwoFactorPhoneVerification(phone);
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      client.setQueryData(getDeliveryKey(), result);
      return result;
    },
  });
}
export function useConfirmTwoFactorRegistrationMutation() {
  const client = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (body: SecondFactorForm) => {
      const sessionId = tokenStorage.getSessionId();
      const result = await postConfirmTwoFactorPhoneVerification(body);
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      client.setQueryData(twoFactorQueryOptions.queryKey, result);
      await client.invalidateQueries({ queryKey: myInfoQueryOptions.queryKey });
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      return result;
    },
  });
}
