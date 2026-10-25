import { useQuery } from '@tanstack/react-query';

import { getMyAccount } from '@/apis/account';
import { useAuthStore } from '@/stores/useAuthStore';

// 내 계좌(보유·예약·사용 가능 포인트)는 회원만 조회할 수 있습니다.
export const useMyAccountQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['accounts', 'me'],
    queryFn: getMyAccount,
    enabled: isLoggedIn,
  });
};
