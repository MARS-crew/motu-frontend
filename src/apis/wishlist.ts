import { api } from '@/apis/instance';
import type { ApiResponse, CursorPage } from '@/types/api';
import type { StockItem } from '@/types/stock';

export const putWishlist = async (stockId: number) => {
  await api.put(`/wishlists/${stockId}`);
};

export const deleteWishlist = async (stockId: number) => {
  await api.delete(`/wishlists/${stockId}`);
};

type GetWishlistsParams = {
  cursor?: string;
  size?: number;
};

export const getWishlists = async (params: GetWishlistsParams) => {
  const { data } = await api.get<ApiResponse<CursorPage<StockItem>>>('/wishlists', { params });
  return data.data;
};
