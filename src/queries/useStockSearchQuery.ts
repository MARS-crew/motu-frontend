import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { searchStocks } from '@/apis/stock';
import { SEARCH_HISTORIES_QUERY_KEY } from '@/queries/useSearchHistoriesQuery';

const SEARCH_PAGE_SIZE = 20;

// keyword가 null이면 검색하지 않습니다.
export const useStockSearchQuery = (keyword: string | null) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ['stocks', 'search', keyword],
    queryFn: async ({ pageParam }) => {
      const page = await searchStocks({
        keyword: keyword ?? '',
        cursor: pageParam,
        size: SEARCH_PAGE_SIZE,
      });
      // 첫 페이지 조회 시 서버가 최근 검색어를 저장하므로 목록을 다시 불러옵니다.
      if (!pageParam) void queryClient.invalidateQueries({ queryKey: SEARCH_HISTORIES_QUERY_KEY });
      return page;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(keyword),
  });
};
