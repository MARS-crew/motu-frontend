import { useInfiniteQuery } from '@tanstack/react-query';

import { getStocks } from '@/apis/stock';
import type { MarketSort } from '@/types/product';
import { toProduct } from '@/utils/stock';

const STOCKS_PAGE_SIZE = 20;

type UseStocksQueryParams = {
  sectorCode: number | null;
  sort: MarketSort;
};

// 마켓 상품 목록입니다. 비회원도 조회할 수 있고, 회원이면 관심 여부가 채워집니다.
export const useStocksQuery = ({ sectorCode, sort }: UseStocksQueryParams) =>
  useInfiniteQuery({
    queryKey: ['stocks', 'list', sectorCode, sort],
    queryFn: ({ pageParam }) =>
      getStocks({
        cursor: pageParam,
        size: STOCKS_PAGE_SIZE,
        sectorCode: sectorCode ?? undefined,
        sort,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.items.map(toProduct)),
  });
