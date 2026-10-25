import { useInfiniteQuery } from '@tanstack/react-query';

import { getNewListings } from '@/apis/stock';
import { toNewListing } from '@/utils/stock';

const NEW_LISTINGS_PAGE_SIZE = 20;

// 신규 상장 전체 목록입니다. 비회원도 조회할 수 있고, 회원이면 관심 여부가 채워집니다.
export const useNewListingsQuery = () =>
  useInfiniteQuery({
    queryKey: ['stocks', 'new-listings', 'list'],
    queryFn: ({ pageParam }) => getNewListings({ cursor: pageParam, size: NEW_LISTINGS_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.items.map(toNewListing)),
  });
