import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { getListingRevisionContext } from '@/apis/listingRevision';
import { getListingImageCollection } from '@/apis/listingFile';
import { useAuthStore } from '@/stores/useAuthStore';

export const listingRevisionKey = (id: number) => ['listing-applications', 'revision', id] as const;
export const listingRevisionEvidenceKey = (id: string | null) =>
  ['listing-revision-evidence', id] as const;

export function useListingRevisionQuery(id: number | null) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isFocused = useIsFocused();
  return useQuery({
    queryKey: listingRevisionKey(id ?? 0),
    queryFn: ({ signal }) => {
      if (!id) throw new Error('올바른 신청서 번호가 아닙니다.');
      return getListingRevisionContext(id, signal);
    },
    enabled: isLoggedIn && isFocused && id !== null,
    select: (data) => (isLoggedIn ? data : undefined),
    retry: false,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: 'always',
  });
}
export function useListingRevisionEvidenceQuery(id: string | null) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: listingRevisionEvidenceKey(id),
    queryFn: async ({ signal }) => {
      if (!id) throw new Error('증빙 자료를 확인하지 못했습니다.');
      const result = await getListingImageCollection(id, signal);
      if (result.purpose !== 'EVIDENCE') throw new Error('증빙 자료 묶음이 아닙니다.');
      return result;
    },
    enabled: isLoggedIn && id !== null,
    select: (data) => (isLoggedIn ? data : undefined),
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });
}
