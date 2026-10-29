import { api } from '@/apis/instance';
import {
  filledOrderListSchema,
  tradeHistoryParamsSchema,
  tradeHistoryPeriodSchema,
  tradeHistoryListSchema,
  tradeHistorySummarySchema,
  type TradeHistoryParams,
  type TradeHistoryPeriod,
} from '@/schemas/tradeHistorySchema';
import type { ApiResponse } from '@/types/api';

export async function getTradeHistories(params: TradeHistoryParams, signal?: AbortSignal) {
  const request = tradeHistoryParamsSchema.parse(params);
  const { data } = await api.get<ApiResponse<unknown>>('/trade-histories', {
    params: request,
    signal,
  });
  const result = tradeHistoryListSchema.parse(data.data);
  // 조회 중 건수가 줄어 현재 페이지가 사라지면 마지막 유효 페이지를 조회합니다.
  const lastPage = Math.ceil(result.totalCount / result.size);
  if (result.items.length === 0 && lastPage > 0 && result.page > lastPage) {
    const response = await api.get<ApiResponse<unknown>>('/trade-histories', {
      params: { ...request, page: lastPage },
      signal,
    });
    return tradeHistoryListSchema.parse(response.data.data);
  }
  return result;
}
export async function getTradeHistorySummary(params: TradeHistoryPeriod, signal?: AbortSignal) {
  const { data } = await api.get<ApiResponse<unknown>>('/trade-histories/summary', {
    params: tradeHistoryPeriodSchema.parse(params),
    signal,
  });
  return tradeHistorySummarySchema.parse(data.data);
}

export async function getFilledOrders(params: TradeHistoryParams, signal?: AbortSignal) {
  const request = tradeHistoryParamsSchema.parse(params);
  const { data } = await api.get<ApiResponse<unknown>>('/trade-histories/filled-orders', {
    params: request,
    signal,
  });
  const result = filledOrderListSchema.parse(data.data);
  const lastPage = Math.ceil(result.totalCount / result.size);
  if (result.items.length === 0 && lastPage > 0 && result.page > lastPage) {
    const response = await api.get<ApiResponse<unknown>>('/trade-histories/filled-orders', {
      params: { ...request, page: lastPage },
      signal,
    });
    return filledOrderListSchema.parse(response.data.data);
  }
  return result;
}
