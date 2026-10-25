import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { SearchHistory } from '@/types/search';

export const getSearchHistories = async () => {
  const { data } = await api.get<ApiResponse<{ items: SearchHistory[] }>>('/search-histories');
  return data.data.items;
};

export const deleteSearchHistory = async (searchHistoryId: number) => {
  await api.delete(`/search-histories/${searchHistoryId}`);
};

export const deleteAllSearchHistories = async () => {
  await api.delete('/search-histories');
};
