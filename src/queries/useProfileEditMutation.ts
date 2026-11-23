import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchMyProfile, postConfirmProfileEditEmail, postProfileEditEmail } from '@/apis/user';
import { myInfoQueryOptions } from '@/queries/useMyInfoQuery';

export const useSendProfileEditEmailMutation = () =>
  useMutation({ mutationFn: postProfileEditEmail, retry: false });

export const useConfirmProfileEditEmailMutation = () =>
  useMutation({ mutationFn: postConfirmProfileEditEmail, retry: false });

// 저장에 성공하면 마이페이지가 바뀐 정보로 다시 그려지도록 내 정보를 새로 불러옵니다.
export function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchMyProfile,
    retry: false,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: myInfoQueryOptions.queryKey }),
  });
}
