import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { getListingDrafts } from '@/apis/listingDraft';
import { useAuthStore } from '@/stores/useAuthStore';

export const LISTING_DRAFTS_QUERY_KEY = ['listing-applications', 'drafts'] as const;

export function useListingDraftsQuery(limit: 2 | 5) {
  const isFocused = useIsFocused();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: [...LISTING_DRAFTS_QUERY_KEY, limit],
    queryFn: ({ signal }) => getListingDrafts(limit, signal),
    enabled: isFocused && isLoggedIn,
    select: (data) => (isLoggedIn ? data : undefined),
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });
}
