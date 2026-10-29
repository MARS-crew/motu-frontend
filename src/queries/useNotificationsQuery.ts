import { useInfiniteQuery } from '@tanstack/react-query';

import { getNotifications } from '@/apis/notification';
import { useAuthStore } from '@/stores/useAuthStore';
import { toAppNotification } from '@/utils/notification';

const NOTIFICATIONS_PAGE_SIZE = 20;

// 알림은 회원만 조회할 수 있습니다. 최신 발생순으로 내려옵니다.
export const useNotificationsQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useInfiniteQuery({
    queryKey: ['notifications', 'list'],
    queryFn: ({ pageParam }) =>
      getNotifications({ page: pageParam, size: NOTIFICATIONS_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page * lastPage.size < lastPage.totalCount ? lastPage.page + 1 : undefined,
    select: (data) => data.pages.flatMap((page) => page.items.map(toAppNotification)),
    enabled: isLoggedIn,
  });
};
