import { useQuery } from '@tanstack/react-query';

import { getPointGrantStatus } from '@/apis/point';

export const POINT_GRANT_QUERY_KEY = ['accounts', 'me', 'point-grant'] as const;

export const usePointGrantQuery = (isEnabled: boolean) =>
  useQuery({
    queryKey: POINT_GRANT_QUERY_KEY,
    queryFn: async ({ signal }) => {
      const status = await getPointGrantStatus(signal);
      return { status, receivedAt: Date.now() };
    },
    enabled: isEnabled,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    // 대기 시간이 0이어도 서버가 허용하기 전에는 버튼을 활성화하지 않습니다.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return query.state.status === 'success' &&
        status &&
        !status.available &&
        status.remainingSeconds === 0
        ? 30_000
        : false;
    },
  });
