import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { postPointGrant } from '@/apis/point';
import type { PointGrantResult } from '@/schemas/pointGrantSchema';

const POINT_GRANT_RESULT_QUERY_KEY = ['point-operation-result', 'grant'] as const;

// 별도 결과 GET API가 없어 신청 성공 응답을 완료 화면에서 사용합니다.
export const usePointGrantResultQuery = () =>
  useQuery<PointGrantResult | null>({
    queryKey: POINT_GRANT_RESULT_QUERY_KEY,
    queryFn: async () => null,
    enabled: false,
    gcTime: 0,
  });

export function usePointGrantMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postPointGrant,
    retry: false,
    onMutate: () => {
      queryClient.setQueryData(POINT_GRANT_RESULT_QUERY_KEY, null);
    },
    onSuccess: (result) => {
      queryClient.setQueryData(POINT_GRANT_RESULT_QUERY_KEY, result);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['accounts', 'me'] });
    },
  });
}
