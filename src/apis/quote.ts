import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type {
  CandleInterval,
  CandlePage,
  DailySummaryItem,
  OrderBookItem,
  RecentTradeItem,
} from '@/types/quote';

// 시세 조회는 비회원도 할 수 있습니다.
export const getOrderBook = async (stockId: number) => {
  const { data } = await api.get<ApiResponse<OrderBookItem>>('/orders/book', {
    params: { stockId },
  });
  return data.data;
};

export const getRecentTrades = async (stockId: number) => {
  const { data } = await api.get<ApiResponse<{ stockId: number; items: RecentTradeItem[] }>>(
    '/trades/recent',
    { params: { stockId } },
  );
  return data.data.items;
};

export const getDailySummary = async (stockId: number) => {
  const { data } = await api.get<ApiResponse<DailySummaryItem>>('/charts/summary', {
    params: { stockId },
  });
  return data.data;
};

type GetCandlesParams = {
  stockId: number;
  interval: CandleInterval;
  size: number;
};

export const getCandles = async (params: GetCandlesParams) => {
  const { data } = await api.get<ApiResponse<CandlePage>>('/charts', { params });
  return data.data;
};
