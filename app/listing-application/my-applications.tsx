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
import { useListingDraftsQuery } from '@/queries/useListingDraftsQuery';
import { toListingDraftListItem } from '@/utils/listingDraft';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function MyListingApplicationsScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [filter, setFilter] = useState<ListingApplicationFilter>('all');
  const draftsQuery = useListingDraftsQuery(5);
  const summary = draftsQuery.isSuccess ? draftsQuery.data : undefined;
  const applications = useListingDraftStore((state) => state.applications);
  const draftItems: ListingApplicationListItem[] = summary?.items.map(toListingDraftListItem) ?? [];
  const submittedItems = Object.values(applications).sort((a, b) =>
    b.submittedDate.localeCompare(a.submittedDate),
  );
  const allItems = [...draftItems, ...submittedItems];
  const items = allItems.filter((application) => filter === 'all' || application.status === filter);
  const hasNoApplication = allItems.length === 0;
  const filterLabel = LISTING_APPLICATION_FILTERS.find((option) => option.value === filter)?.label;
  const handleBack = () => router.dismissTo('/listing-application');
  const handleContinue = (draftId: string) => {
    router.push({
      pathname: getListingDraftRoute(
        summary?.items.find((draft) => String(draft.id) === draftId)?.currentStep,
      ),
      params: { draftId },
    });
  };
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
              onOpen={handleOpen}
            />
          ))}
          {items.length === 0 &&
            !draftsQuery.isPending &&
            !draftsQuery.isError &&
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
