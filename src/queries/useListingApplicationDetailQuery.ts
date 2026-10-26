import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { getListingApplicationDetail } from '@/apis/listingApplication';
import { useAuthStore } from '@/stores/useAuthStore';

export function useListingApplicationDetailQuery(id: number | null) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isFocused = useIsFocused();
  return useQuery({
    queryKey: ['listing-applications', 'detail', id],
    queryFn: ({ signal }) => {
      if (!id) throw new Error('올바른 신청서 번호가 아닙니다.');
      return getListingApplicationDetail(id, signal);
    },
    enabled: id !== null && isLoggedIn && isFocused,
    select: (data) => (isLoggedIn ? data : undefined),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}
