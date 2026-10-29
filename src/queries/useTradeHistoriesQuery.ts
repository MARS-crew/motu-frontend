import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';
import { useEffect } from 'react';

import { getTradeHistories, getTradeHistorySummary } from '@/apis/tradeHistory';
import type { TradeHistoryParams } from '@/schemas/tradeHistorySchema';
import { useAuthStore } from '@/stores/useAuthStore';

export const TRADE_HISTORIES_QUERY_KEY = ['trade-histories'] as const;

export function useTradeHistoriesQuery(params: TradeHistoryParams, isHistoryTab: boolean) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isFocused = useIsFocused();
  const queryClient = useQueryClient();
  const enabled = isLoggedIn && isFocused && isHistoryTab;
  useEffect(() => {
    if (!isLoggedIn) queryClient.removeQueries({ queryKey: TRADE_HISTORIES_QUERY_KEY });
  }, [isLoggedIn, queryClient]);
  const historyQuery = useQuery({
    queryKey: [...TRADE_HISTORIES_QUERY_KEY, 'list', params],
    queryFn: ({ signal }) => getTradeHistories(params, signal),
    enabled,
    select: (data) => (isLoggedIn ? data : undefined),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
  const summaryQuery = useQuery({
    queryKey: [...TRADE_HISTORIES_QUERY_KEY, 'summary', params.from, params.to],
    queryFn: ({ signal }) => getTradeHistorySummary({ from: params.from, to: params.to }, signal),
    enabled,
    select: (data) => (isLoggedIn ? data : undefined),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
  return { historyQuery, summaryQuery, isLoggedIn };
}
