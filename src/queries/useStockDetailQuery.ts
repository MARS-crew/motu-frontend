import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getStockDetail } from '@/apis/stock';
import { toProductDetail } from '@/utils/stock';

export const useStockDetailQuery = (stockId: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['stocks', 'detail', stockId],
    queryFn: async () => {
      const stock = await getStockDetail(stockId);
      // 상세 조회 시 서버가 최근 본 종목을 기록하므로 홈 목록을 다시 불러옵니다.
      void queryClient.invalidateQueries({ queryKey: ['stocks', 'recently-viewed'] });
      return stock;
    },
    select: toProductDetail,
    enabled: Number.isInteger(stockId),
  });
};
