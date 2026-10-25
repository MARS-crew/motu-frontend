import { api } from '@/apis/instance';
import type { ApiResponse, CursorPage } from '@/types/api';
import type { NewListingItem, StockItem } from '@/types/stock';

type CursorParams = {
  cursor?: string;
  size?: number;
};

export const getNewListings = async (params: CursorParams) => {
  const { data } = await api.get<ApiResponse<CursorPage<NewListingItem>>>('/stocks/new-listings', {
    params,
  });
  return data.data;
};

export const getRecentlyViewed = async () => {
  const { data } = await api.get<ApiResponse<{ items: StockItem[] }>>('/stocks/recently-viewed');
  return data.data.items;
};
