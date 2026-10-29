import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { CreateOrderBody, OrderAvailableItem, OrderItem } from '@/types/order';

// 주문 화면에 들어갈 때 호가 단위·최소 주문 값·수수료율·사용 가능 포인트·매도 가능 수량을 받습니다.
export const getOrderAvailable = async (stockId: number) => {
  const { data } = await api.get<ApiResponse<OrderAvailableItem>>('/orders/available', {
    params: { stockId },
  });
  return data.data;
};

// 지정가 주문을 접수하고 바로 체결을 시도합니다. 같은 clientOrderId로 다시 보내면 접수된 주문을 돌려줍니다.
export const postOrder = async (body: CreateOrderBody) => {
  const { data } = await api.post<ApiResponse<OrderItem>>('/orders', body);
  return data.data;
};
