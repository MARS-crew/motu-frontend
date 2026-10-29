import { useQuery } from '@tanstack/react-query';

import { getOrderAvailable } from '@/apis/orderEntry';
import { useAuthStore } from '@/stores/useAuthStore';
import { toOrderAvailability } from '@/utils/order';

// 주문은 회원만 할 수 있어 로그인 상태에서만 조회합니다.
export const useOrderAvailableQuery = (stockId: number) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['orders', 'available', stockId],
    queryFn: () => getOrderAvailable(stockId),
    select: toOrderAvailability,
    enabled: isLoggedIn && Number.isInteger(stockId),
  });
};
