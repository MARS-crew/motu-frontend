import { useQuery } from '@tanstack/react-query';

import { getListingDraftDetail } from '@/apis/listingDraft';
import { getListingImageCollection } from '@/apis/listingFile';
import { useAuthStore } from '@/stores/useAuthStore';

export const listingBasicDraftKey = (id: number) =>
  ['listing-applications', 'draft', id, 'basic-info'] as const;

export function useListingBasicDraftQuery(id: number | null, isSaving: boolean) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery({
    queryKey: listingBasicDraftKey(id ?? 0),
    queryFn: async ({ signal }) => {
      if (!id) throw new Error('올바른 신청서 번호가 아닙니다.');
      const draft = await getListingDraftDetail(id, signal);
      const [logo, cover] = await Promise.all([
        draft.data.logoCollectionId
          ? getListingImageCollection(draft.data.logoCollectionId, signal)
          : null,
        draft.data.mainImageCollectionId
          ? getListingImageCollection(draft.data.mainImageCollectionId, signal)
          : null,
      ]);
      return { draft, logo, cover };
    },
    enabled: isLoggedIn && id !== null && !isSaving,
    retry: false,
    staleTime: 0,
    gcTime: 0,
    // 작성 중 입력값은 재조회 응답으로 덮어쓰지 않습니다.
    refetchOnWindowFocus: false,
  });
}
