import { useQuery } from '@tanstack/react-query';

import { getNewListings } from '@/apis/stock';
import { useAuthStore } from '@/stores/useAuthStore';

// 홈은 최신 상장 3개만 보여줍니다. 전체 목록은 신규 상장 화면에서 커서로 이어서 조회합니다.
const HOME_NEW_LISTINGS_SIZE = 3;

export const useHomeNewListingsQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['stocks', 'new-listings', 'home'],
    queryFn: async () => (await getNewListings({ size: HOME_NEW_LISTINGS_SIZE })).items,
    // API는 비회원도 호출할 수 있지만, 홈 화면은 비회원에게 로그인 안내를 보여줍니다.
    enabled: isLoggedIn,
  });
};
