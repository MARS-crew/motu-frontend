import { api } from '@/apis/instance';
import { cancelOrderIdSchema, cancelOrderResultSchema } from '@/schemas/orderSchema';
import type { ApiResponse } from '@/types/api';

export async function cancelOrder(orderId: number) {
  const id = cancelOrderIdSchema.parse(orderId);
  const { data } = await api.post<ApiResponse<unknown>>(`/orders/${id}/cancel`);
  return cancelOrderResultSchema.parse(data.data);
}
