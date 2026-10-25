import { useQuery } from '@tanstack/react-query';

import { getSearchHistories } from '@/apis/searchHistory';
import { useAuthStore } from '@/stores/useAuthStore';

export const SEARCH_HISTORIES_QUERY_KEY = ['search-histories'];

// 최근 검색은 로그인한 회원만 조회할 수 있습니다.
export const useSearchHistoriesQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: SEARCH_HISTORIES_QUERY_KEY,
    queryFn: getSearchHistories,
    enabled: isLoggedIn,
  });
};
