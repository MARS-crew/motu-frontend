import { useQuery } from '@tanstack/react-query';

import { getRecentlyViewed } from '@/apis/stock';
import { useAuthStore } from '@/stores/useAuthStore';

// 로그인한 회원만 조회할 수 있습니다.
export const useRecentlyViewedQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['stocks', 'recently-viewed'],
    queryFn: getRecentlyViewed,
    enabled: isLoggedIn,
  });
};
