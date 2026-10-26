import { useLocalSearchParams } from 'expo-router';

import { ListingServerSupplement } from '@/components/listingApplication/ListingServerSupplement';
import { ListingPreviewSupplementEvidence } from '@/components/listingApplication/ListingPreviewSupplementEvidence';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function SupplementEvidenceScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const parsedId = Number(applicationId);
  const id = Number.isSafeInteger(parsedId) && parsedId > 0 ? parsedId : null;
  const hasPreview = useListingDraftStore((state) =>
    Boolean(applicationId && state.applications[applicationId]),
  );
  return id === null && hasPreview ? (
    <ListingPreviewSupplementEvidence />
  ) : (
    <ListingServerSupplement applicationId={id} mode="editor" />
  );
}
