import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postLogin } from '@/apis/auth';
import { SessionChangedError } from '@/apis/instance';
import type { LoginForm } from '@/schemas/authSchema';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export const useLoginMutation = () => {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);
  const queryClient = useQueryClient();
  return useMutation({
    retry: false,
    mutationFn: async (form: LoginForm) => {
      const previousSessionId = tokenStorage.getSessionId();
      const result = await postLogin(form);
      if (previousSessionId !== tokenStorage.getSessionId()) throw new SessionChangedError();
      const persistence = tokenStorage.setTokens(result.accessToken, result.refreshToken);
      const revision = tokenStorage.getRevision();
      await persistence;
      if (revision !== tokenStorage.getRevision()) throw new SessionChangedError();
      return { result, revision };
    },
    onSuccess: async ({ revision }) => {
      await queryClient.cancelQueries();
      if (revision !== tokenStorage.getRevision()) return;
      // 다른 계정의 서버 캐시가 로그인한 계정에 노출되지 않게 합니다.
      queryClient.removeQueries();
      setLoggedIn(true);
    },
  });
};
