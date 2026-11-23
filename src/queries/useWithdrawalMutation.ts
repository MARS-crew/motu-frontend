import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { clearAuthSession, SessionChangedError } from '@/apis/instance';
import { postWithdrawal } from '@/apis/user';
import type { WithdrawalForm } from '@/schemas/withdrawalSchema';
import { useSignupFormStore } from '@/stores/useSignupFormStore';
import { pendingLoginStorage } from '@/utils/pendingLoginStorage';
import { tokenStorage } from '@/utils/tokenStorage';

export function useWithdrawalMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (body: WithdrawalForm) => {
      const sessionId = tokenStorage.getSessionId();
      await postWithdrawal(body);
      if (sessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();

      // 서버 탈퇴가 성공한 뒤에만 세션을 정리합니다.
      const clearing = clearAuthSession();
      const clearedSessionId = tokenStorage.getSessionId();
      useSignupFormStore.getState().reset();
      await Promise.allSettled([
        clearing,
        pendingLoginStorage.clear(),
        queryClient.cancelQueries(),
      ]);
      if (clearedSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      queryClient.clear();
      router.replace('/(auth)/login');
    },
  });
}
