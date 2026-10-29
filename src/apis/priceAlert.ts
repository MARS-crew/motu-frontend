import { api } from '@/apis/instance';
import type { ApiResponse, CursorPage } from '@/types/api';
import type { PriceAlertItem } from '@/types/priceAlert';

type GetPriceAlertsParams = {
  stockId: number;
  size?: number;
};

// 최근 등록순이고, 이미 울린 알림(isActive=false)도 함께 내려옵니다.
export const getPriceAlerts = async (params: GetPriceAlertsParams) => {
  const { data } = await api.get<ApiResponse<CursorPage<PriceAlertItem>>>('/price-alerts', {
    params,
  });
  return data.data.items;
};

export const postPriceAlert = async (body: { stockId: number; targetPrice: number }) => {
  const { data } = await api.post<ApiResponse<PriceAlertItem>>('/price-alerts', body);
  return data.data;
};

// 가격을 바꾸면 이미 울린 알림도 다시 켜집니다.
export const patchPriceAlert = async (alertId: number, targetPrice: number) => {
  const { data } = await api.patch<ApiResponse<PriceAlertItem>>(`/price-alerts/${alertId}`, {
    targetPrice,
  });
  return data.data;
};

export const deletePriceAlert = async (alertId: number) => {
  await api.delete(`/price-alerts/${alertId}`);
};
