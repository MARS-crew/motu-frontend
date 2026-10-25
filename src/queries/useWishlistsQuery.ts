import { useInfiniteQuery } from '@tanstack/react-query';

import { getWishlists } from '@/apis/wishlist';
import { useAuthStore } from '@/stores/useAuthStore';
import { toProduct } from '@/utils/stock';

const WISHLISTS_PAGE_SIZE = 20;

// 관심 상품은 회원만 조회할 수 있습니다. 최근에 추가한 순서로 내려옵니다.
export const useWishlistsQuery = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useInfiniteQuery({
    queryKey: ['wishlists', 'list'],
    queryFn: ({ pageParam }) => getWishlists({ cursor: pageParam, size: WISHLISTS_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((page) => page.items.map(toProduct)),
    enabled: isLoggedIn,
  });
};
