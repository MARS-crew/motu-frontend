import { useLocalSearchParams } from 'expo-router';

import { ListingFetchedApplicationDetail } from '@/components/listingApplication/ListingFetchedApplicationDetail';
import { ListingPreviewApplicationDetail } from '@/components/listingApplication/ListingPreviewApplicationDetail';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function ListingApplicationDetailScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const parsedId = Number(applicationId);
  const id = Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const hasPreview = useListingDraftStore((state) =>
    Boolean(applicationId && state.applications[applicationId]),
  );
  // 서버 ID가 있는 신청서는 로컬 예시 데이터로 대체하지 않습니다.
  return id === null && hasPreview ? (
    <ListingPreviewApplicationDetail />
  ) : (
    <ListingFetchedApplicationDetail id={id} />
  );
}
