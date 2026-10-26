import { useQuery } from '@tanstack/react-query';

import { getListingDraftDetail } from '@/apis/listingDraft';
import { useAuthStore } from '@/stores/useAuthStore';

export const listingTradingDraftKey = (id: number) =>
  ['listing-applications', 'draft', id, 'trading-info'] as const;

export function useListingTradingDraftQuery(id: number | null, isSaving: boolean) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: listingTradingDraftKey(id ?? 0),
    queryFn: ({ signal }) => {
      if (!id) throw new Error('올바른 신청서 번호가 아닙니다.');
      return getListingDraftDetail(id, signal);
    },
    enabled: isLoggedIn && id !== null && !isSaving,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
}
