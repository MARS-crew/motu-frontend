import { useQuery } from '@tanstack/react-query';

import { getTradeHistorySummary } from '@/apis/tradeHistory';
import { TRADE_HISTORIES_QUERY_KEY } from '@/queries/useTradeHistoriesQuery';
import type { TradeHistoryPeriod } from '@/schemas/tradeHistorySchema';
import { useAuthStore } from '@/stores/useAuthStore';

// 기간 내 총·매수·매도 거래금액입니다. 거래내역 화면과 같은 키를 써서 주문·취소 후 함께 다시 조회됩니다.
export const useTradeHistorySummaryQuery = ({ from, to }: TradeHistoryPeriod) => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: [...TRADE_HISTORIES_QUERY_KEY, 'summary', from, to],
    queryFn: ({ signal }) => getTradeHistorySummary({ from, to }, signal),
    enabled: isLoggedIn,
  });
};
