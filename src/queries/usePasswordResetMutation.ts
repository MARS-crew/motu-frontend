import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearAuthSession } from '@/apis/instance';
import {
  postConfirmPasswordReset,
  postRequestPasswordReset,
  postVerifyPasswordReset,
} from '@/apis/passwordReset';
import { pendingLoginStorage } from '@/utils/pendingLoginStorage';

// 일회용 재설정 토큰과 비밀번호를 영구 저장하거나 Query 키에 넣지 않습니다.
export const useRequestPasswordResetMutation = () =>
  useMutation({ mutationFn: postRequestPasswordReset, retry: false, gcTime: 0 });

export const useVerifyPasswordResetMutation = () =>
  useMutation({ mutationFn: postVerifyPasswordReset, retry: false, gcTime: 0 });

export function useConfirmPasswordResetMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: postConfirmPasswordReset,
    retry: false,
    gcTime: 0,
    onSuccess: async () => {
      // 서버가 이미 링크를 사용 처리했으므로 로컬 정리 실패로 재제출하지 않습니다.
      await Promise.allSettled([
        clearAuthSession(),
        pendingLoginStorage.clear(),
        client.cancelQueries(),
      ]);
      client.removeQueries();
    },
  });
}
