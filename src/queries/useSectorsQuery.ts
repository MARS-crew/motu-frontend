import { useQuery } from '@tanstack/react-query';

import { getSectors } from '@/apis/sector';

// 카테고리는 상장 신청 항목값으로 고정되어 있어 앱 실행 중에는 다시 불러오지 않습니다.
export const useSectorsQuery = () =>
  useQuery({
    queryKey: ['sectors'],
    queryFn: getSectors,
    staleTime: Infinity,
  });
