import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelOrder } from '@/apis/order';
import { TRADE_HISTORIES_QUERY_KEY } from '@/queries/useTradeHistoriesQuery';

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    retry: false,
    // 체결과 취소가 경합하여 실패한 경우에도 서버의 최신 주문 상태를 조회합니다.
    onSettled: async () => {
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: TRADE_HISTORIES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ['accounts', 'me'] }),
      ]);
    },
  });
}
