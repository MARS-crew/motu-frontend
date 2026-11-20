import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postLogin } from '@/apis/auth';
import { SessionChangedError } from '@/apis/instance';
import type { LoginForm } from '@/schemas/authSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';
import { pendingLoginStorage } from '@/utils/pendingLoginStorage';
import { saveLoginSession } from '@/utils/loginSession';
import { LOGIN_CHALLENGE_KEY, LOGIN_DELIVERY_KEY } from '@/queries/useLoginVerificationMutation';

export const useLoginMutation = () => {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (form: LoginForm) => {
      const previousSessionId = tokenStorage.getSessionId();
      await pendingLoginStorage.clear();
      queryClient.removeQueries({ queryKey: LOGIN_CHALLENGE_KEY });
      queryClient.removeQueries({ queryKey: LOGIN_DELIVERY_KEY });
      const result = await postLogin(form);
      if (previousSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      if (result.verificationRequired) {
        await pendingLoginStorage.set(result);
        return { result, revision: null };
      }
      const revision = await saveLoginSession(result, previousSessionId);
      return { result, revision };
    },
    onSuccess: async ({ revision }) => {
      if (revision === null) return;
      await queryClient.cancelQueries();
      if (revision !== tokenStorage.getRevision()) return;
      // 다른 계정의 서버 캐시가 로그인한 계정에 노출되지 않게 합니다.
      queryClient.removeQueries();
      setLoggedIn(true);
    },
  });
};
