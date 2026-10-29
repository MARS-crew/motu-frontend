import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postOrder } from '@/apis/orderEntry';
import { TRADE_HISTORIES_QUERY_KEY } from '@/queries/useTradeHistoriesQuery';

// 주문하면 바로 체결될 수 있어 시세·주문 가능 정보·계좌·거래내역·알림을 함께 새로 불러옵니다.
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postOrder,
    // 완료 화면이 늦게 뜨지 않도록 다시 불러오기는 기다리지 않습니다.
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['quotes'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: ['accounts', 'me'] });
      void queryClient.invalidateQueries({ queryKey: TRADE_HISTORIES_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};
