import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deleteWishlist, putWishlist } from '@/apis/wishlist';

type WishlistVariables = {
  stockId: number;
  isWishlisted: boolean;
};

// 현재 관심 여부를 받아 등록/해제를 반대로 요청합니다.
export const useWishlistMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stockId, isWishlisted }: WishlistVariables) =>
      isWishlisted ? deleteWishlist(stockId) : putWishlist(stockId),
    // 상품 목록 응답마다 관심 여부가 들어 있어 상품·관심 상품 조회를 모두 새로 불러옵니다.
    onSettled: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['stocks'] }),
        queryClient.invalidateQueries({ queryKey: ['wishlists'] }),
      ]),
  });
};
