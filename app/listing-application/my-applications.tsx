import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { ListingApplicationCard } from '@/components/listingApplication/ListingApplicationCard';
import { ListingApplicationEmpty } from '@/components/listingApplication/ListingApplicationEmpty';
import { ListingApplicationFilters } from '@/components/listingApplication/ListingApplicationFilters';
import { LISTING_APPLICATION_FILTERS } from '@/constants/listingApplicationsPreview';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import type {
  ListingApplicationFilter,
  ListingApplicationListItem,
} from '@/types/listingApplication';
import { getListingDraftRoute } from '@/utils/listingApplication';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function MyListingApplicationsScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [filter, setFilter] = useState<ListingApplicationFilter>('all');
  const drafts = useListingDraftStore((state) => state.drafts);
  const applications = useListingDraftStore((state) => state.applications);
  const deleteDraft = useListingDraftStore((state) => state.deleteDraft);
  const draftItems: ListingApplicationListItem[] = Object.entries(drafts)
    .filter(([id]) => !applications[id])
    .map(([id, draft]) => ({
      id,
      name: draft.values.serviceName || '제목 없는 신청서',
      status: 'draft',
      savedDate: draft.savedDate ?? '',
      step: draft.step ?? 1,
    }));
  const submittedItems = Object.values(applications).sort((a, b) =>
    b.submittedDate.localeCompare(a.submittedDate),
  );
  const allItems = [...draftItems, ...submittedItems];
  const items = allItems.filter((application) => filter === 'all' || application.status === filter);
  const hasNoApplication = allItems.length === 0;
  const filterLabel = LISTING_APPLICATION_FILTERS.find((option) => option.value === filter)?.label;
  const handleBack = () => router.dismissTo('/listing-application');
  const handleContinue = (draftId: string) => {
    router.push({ pathname: getListingDraftRoute(drafts[draftId]?.step), params: { draftId } });
  };
  const handleDelete = (draftId: string) => deleteDraft(draftId);
  const handleApply = () => router.dismissTo('/listing-application');
  const handleOpen = (applicationId: string) => {
    router.push({ pathname: '/listing-application/application-detail', params: { applicationId } });
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="내 상장 신청" onBack={handleBack} variant="listing" />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="flex-grow gap-4 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <ListingApplicationFilters value={filter} onChange={setFilter} />
        <View className="gap-2.5">
          {items.map((application) => (
            <ListingApplicationCard
              key={application.id}
              application={application}
              onContinue={handleContinue}
              onDelete={handleDelete}
              onOpen={handleOpen}
            />
          ))}
          {items.length === 0 &&
            (hasNoApplication ? (
              <ListingApplicationEmpty onApplyPress={handleApply} />
            ) : (
              <ListingApplicationEmpty filterLabel={filterLabel} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
