import { useQuery } from '@tanstack/react-query';

import { getDailySummary } from '@/apis/quote';
import { QUOTE_REFETCH_INTERVAL } from '@/constants/quote';
import { toTradeSummary } from '@/utils/quote';

// 당일(한국 시간 00시부터) 거래 요약과 현재가·전일 대비를 함께 받습니다.
export const useTradeSummaryQuery = (stockId: number) =>
  useQuery({
    queryKey: ['quotes', 'summary', stockId],
    queryFn: () => getDailySummary(stockId),
    select: toTradeSummary,
    enabled: Number.isInteger(stockId),
    refetchInterval: QUOTE_REFETCH_INTERVAL,
  });
