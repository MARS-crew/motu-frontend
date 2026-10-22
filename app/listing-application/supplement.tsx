import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { ListingAdminOpinion } from '@/components/listingApplication/ListingAdminOpinion';
import { ListingApplicationInfoCard } from '@/components/listingApplication/ListingApplicationInfoCard';
import { ListingApplicationStatusBadge } from '@/components/listingApplication/ListingApplicationStatusBadge';
import { listingEvidenceSchema } from '@/schemas/listingEvidenceSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function ListingSupplementScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const application = useListingDraftStore((state) =>
    applicationId ? state.applications[applicationId] : undefined,
  );
  const supplementDraft = useListingDraftStore((state) =>
    applicationId ? state.supplementDrafts[applicationId] : undefined,
  );
  const resubmitSupplementPreview = useListingDraftStore(
    (state) => state.resubmitSupplementPreview,
  );
  const handleBack = () =>
    router.dismissTo({
      pathname: '/listing-application/application-detail',
      params: { applicationId },
    });
  const handleEdit = () =>
    router.push({
      pathname: '/listing-application/supplement-evidence',
      params: { applicationId },
    });
  const handleResubmit = () => {
    if (!applicationId || !resubmitSupplementPreview(applicationId)) return;
    router.replace({
      pathname: '/listing-application/supplement-complete',
      params: { applicationId },
    });
  };
  if (application?.status === 'reviewing')
    return (
      <Redirect
        href={{ pathname: '/listing-application/supplement-complete', params: { applicationId } }}
      />
    );
  if (application?.status !== 'supplementRequested')
    return <Redirect href="/listing-application/my-applications" />;
  const canResubmit = listingEvidenceSchema.safeParse(
    supplementDraft ?? application.evidence,
  ).success;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar
        isScrolled={isScrolled}
        title="보완 자료 재제출"
        variant="listing-detail"
        onBack={handleBack}
      />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="self-start">
          <ListingApplicationStatusBadge status={application.status} />
        </View>
        <View className="gap-1.5">
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
          >
            보완 자료를 제출해 주세요.
          </Text>
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
            요청 항목을 수정하거나 파일을 추가한 뒤 재제출합니다.
          </Text>
        </View>
        <ListingAdminOpinion opinion={application.adminOpinion} />
        <ListingApplicationInfoCard
          rows={[{ label: '보완기한', value: application.supplementDeadline }]}
        />
        <View className="min-h-px flex-1" />
        <View className="gap-3">
          <Button title="자료 추가·수정" variant="secondary" onPress={handleEdit} />
          <Button title="재제출" onPress={handleResubmit} disabled={!canResubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
