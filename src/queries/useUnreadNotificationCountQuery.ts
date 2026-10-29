import { useQuery } from '@tanstack/react-query';

import { getUnreadNotificationCount } from '@/apis/notification';
import { useAuthStore } from '@/stores/useAuthStore';

// 홈 알림 아이콘의 미확인 표시와 알림 화면의 새 알림 수에 씁니다.
export const useUnreadNotificationCountQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: getUnreadNotificationCount,
    enabled: isLoggedIn,
  });
};
