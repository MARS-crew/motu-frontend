import { useQuery } from '@tanstack/react-query';

import { getPriceAlerts } from '@/apis/priceAlert';
import { useAuthStore } from '@/stores/useAuthStore';

// 서버는 한 상품에 알림을 여러 개 둘 수 있지만, 화면설계서는 상품당 하나를 설정·수정·해제합니다.
// 그래서 켜져 있는 알림 중 가장 최근에 등록한 것을 이 상품의 알림으로 봅니다.
export const usePriceAlertQuery = (stockId: number) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: ['price-alerts', stockId],
    queryFn: () => getPriceAlerts({ stockId }),
    select: (alerts) => alerts.find((alert) => alert.isActive) ?? null,
    enabled: isLoggedIn && Number.isInteger(stockId),
  });
};
