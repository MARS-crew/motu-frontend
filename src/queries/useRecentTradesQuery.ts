import { useQuery } from '@tanstack/react-query';

import { getRecentTrades } from '@/apis/quote';
import { QUOTE_REFETCH_INTERVAL } from '@/constants/quote';
import { toRecentTrade } from '@/utils/quote';

// 최신순 최대 5건이 내려옵니다.
export const useRecentTradesQuery = (stockId: number) =>
  useQuery({
    queryKey: ['quotes', 'recent-trades', stockId],
    queryFn: () => getRecentTrades(stockId),
    select: (trades) => trades.map(toRecentTrade),
    enabled: Number.isInteger(stockId),
    refetchInterval: QUOTE_REFETCH_INTERVAL,
  });
