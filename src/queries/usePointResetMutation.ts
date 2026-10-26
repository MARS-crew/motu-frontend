import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postPointReset } from '@/apis/pointReset';
import type { PointResetResult } from '@/schemas/pointResetSchema';

const POINT_RESET_RESULT_QUERY_KEY = ['point-operation-result', 'reset'] as const;

// 별도 결과 GET API가 없어 신청 성공 응답을 완료 화면에서 사용합니다.
export const usePointResetResultQuery = () =>
  useQuery<PointResetResult | null>({
    queryKey: POINT_RESET_RESULT_QUERY_KEY,
    queryFn: async () => null,
    enabled: false,
    gcTime: 0,
  });

export function usePointResetMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPointReset,
    retry: false,
    onMutate: () => {
      queryClient.setQueryData(POINT_RESET_RESULT_QUERY_KEY, null);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(POINT_RESET_RESULT_QUERY_KEY, result);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts', 'me'] });
    },
  });
}
