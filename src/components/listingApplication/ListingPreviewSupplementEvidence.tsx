import { Redirect, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ListingSupplementEditor } from '@/components/listingApplication/ListingSupplementEditor';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export function ListingPreviewSupplementEvidence() {
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const application = useListingDraftStore((state) =>
    applicationId ? state.applications[applicationId] : undefined,
  );
  const supplementDraft = useListingDraftStore((state) =>
    applicationId ? state.supplementDrafts[applicationId] : undefined,
  );
  if (!applicationId || application?.status !== 'supplementRequested') {
    return <Redirect href="/listing-application/my-applications" />;
  }
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <ListingSupplementEditor
        key={applicationId}
        applicationId={applicationId}
        initialValues={supplementDraft ?? application.evidence}
      />
    </SafeAreaView>
  );
}
