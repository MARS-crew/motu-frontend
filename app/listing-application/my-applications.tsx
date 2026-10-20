import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { ListingApplicationCard } from '@/components/listingApplication/ListingApplicationCard';
import { ListingApplicationFilters } from '@/components/listingApplication/ListingApplicationFilters';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import type {
  ListingApplicationFilter,
  ListingApplicationListItem,
} from '@/types/listingApplication';
import { getListingDraftRoute } from '@/utils/listingApplication';

export default function MyListingApplicationsScreen() {
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
  const items = [...draftItems, ...submittedItems].filter(
    (application) => filter === 'all' || application.status === filter,
  );
  const handleBack = () => router.dismissTo('/listing-application');
  const handleContinue = (draftId: string) => {
    router.push({ pathname: getListingDraftRoute(drafts[draftId]?.step), params: { draftId } });
  };
  const handleDelete = (draftId: string) => deleteDraft(draftId);

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="내 상장 신청" onBack={handleBack} variant="listing" />
      <ScrollView
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
            />
          ))}
          {items.length === 0 && (
            <Text
              accessibilityLiveRegion="polite"
              className="py-10 text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary"
            >
              해당 상태의 상장 신청이 없습니다.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
