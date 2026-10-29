import { useQuery } from '@tanstack/react-query';

import { getOrderBook } from '@/apis/quote';
import { QUOTE_REFETCH_INTERVAL } from '@/constants/quote';
import { toOrderBook } from '@/utils/quote';

export const useOrderBookQuery = (stockId: number) =>
  useQuery({
    queryKey: ['quotes', 'order-book', stockId],
    queryFn: () => getOrderBook(stockId),
    select: toOrderBook,
    enabled: Number.isInteger(stockId),
    refetchInterval: QUOTE_REFETCH_INTERVAL,
  });
