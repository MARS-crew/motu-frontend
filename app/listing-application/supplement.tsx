import { useLocalSearchParams } from 'expo-router';

import { ListingServerSupplement } from '@/components/listingApplication/ListingServerSupplement';
import { ListingPreviewSupplement } from '@/components/listingApplication/ListingPreviewSupplement';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function SupplementScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const parsedId = Number(applicationId);
  const id = Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const hasPreview = useListingDraftStore((state) =>
    Boolean(applicationId && state.applications[applicationId]),
  );
  return id === null && hasPreview ? (
    <ListingPreviewSupplement />
  ) : (
    <ListingServerSupplement applicationId={id} mode="start" />
  );
}
