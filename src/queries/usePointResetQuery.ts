import { useQuery } from '@tanstack/react-query';

import { getPointResetStatus } from '@/apis/pointReset';

export const POINT_RESET_QUERY_KEY = ['accounts', 'me', 'point-reset'] as const;

export const usePointResetQuery = (isEnabled: boolean) =>
  useQuery({
    queryKey: POINT_RESET_QUERY_KEY,
    queryFn: async ({ signal }) => ({
      status: await getPointResetStatus(signal),
      receivedAt: Date.now(),
    }),
    enabled: isEnabled,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
