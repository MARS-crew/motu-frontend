import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchNotificationRead } from '@/apis/notification';

// 읽음 처리 후 알림 목록과 미확인 수를 함께 새로 불러옵니다.
export const useReadNotificationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchNotificationRead,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
};
