import { api } from '@/apis/instance';
import type { ApiResponse, CursorPage } from '@/types/api';
import type { MarketSort } from '@/types/product';
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

type SearchStocksParams = CursorParams & {
  keyword: string;
};

// 로그인 상태면 첫 페이지 조회 시 서버가 검색어를 최근 검색에 저장합니다.
export const searchStocks = async (params: SearchStocksParams) => {
  const { data } = await api.get<ApiResponse<CursorPage<StockItem>>>('/stocks/search', {
    params,
  });
  return data.data;
};

type GetStocksParams = CursorParams & {
  // 비우면 전체 카테고리입니다.
  sectorCode?: number;
  sort: MarketSort;
};

export const getStocks = async (params: GetStocksParams) => {
  const { data } = await api.get<ApiResponse<CursorPage<StockItem>>>('/stocks', { params });
  return data.data;
};
