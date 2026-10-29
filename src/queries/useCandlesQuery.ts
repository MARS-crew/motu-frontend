import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getCandles } from '@/apis/quote';
import { CHART_CANDLE_COUNT } from '@/constants/quote';
import type { ChartPeriod } from '@/types/product';
import { CANDLE_INTERVALS, toProductCandle } from '@/utils/quote';

// 최신 봉부터 CHART_CANDLE_COUNT개를 오래된 순으로 받습니다.
export const useCandlesQuery = (stockId: number, period: ChartPeriod) =>
  useQuery({
    queryKey: ['quotes', 'candles', stockId, period],
    queryFn: () =>
      getCandles({ stockId, interval: CANDLE_INTERVALS[period], size: CHART_CANDLE_COUNT }),
    select: (data) => data.items.map(toProductCandle),
    enabled: Number.isInteger(stockId),
    // 기간을 바꾸는 동안 이전 차트를 유지해 깜빡이지 않게 합니다.
    placeholderData: keepPreviousData,
  });
