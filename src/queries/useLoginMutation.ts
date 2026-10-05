import { useMutation } from '@tanstack/react-query';

import { postLogin } from '@/apis/auth';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export const useLoginMutation = () => {
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  return useMutation({
    mutationFn: postLogin,
    onSuccess: async ({ accessToken, refreshToken }) => {
      await tokenStorage.setTokens(accessToken, refreshToken);
      setLoggedIn(true);
    },
  });
};
