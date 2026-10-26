import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TopBar } from '@/components/TopBar';
import { ListingAdminOpinion } from '@/components/listingApplication/ListingAdminOpinion';
import { ListingApplicationInfoCard } from '@/components/listingApplication/ListingApplicationInfoCard';
import { ListingApplicationStatusBadge } from '@/components/listingApplication/ListingApplicationStatusBadge';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import { getListingEvidenceSummary } from '@/utils/listingApplication';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export function ListingPreviewApplicationDetail() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const application = useListingDraftStore((state) =>
    applicationId ? state.applications[applicationId] : undefined,
  );
  const handleBack = () => router.dismissTo('/listing-application/my-applications');
  const handleWriteSupplement = () =>
    router.push({ pathname: '/listing-application/supplement', params: { applicationId } });

  if (!application || application.status === 'approved' || application.status === 'rejected') {
    return <Redirect href="/listing-application/my-applications" />;
  }
  const rows =
    application.status === 'received'
      ? [
          { label: '제출일시', value: application.submittedAt },
          { label: '증빙 파일', value: getListingEvidenceSummary(application.evidenceItems) },
        ]
      : application.status === 'supplementRequested'
        ? [
            { label: '신청일', value: application.submittedDate },
            { label: '보완기한', value: application.supplementDeadline },
          ]
        : [
            { label: '신청번호', value: application.receiptNumber },
            { label: '보완 자료', value: '제출 완료' },
          ];

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar
        isScrolled={isScrolled}
        title="신청 상세"
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
        <View className="flex-row items-center gap-2">
          <Text
            accessibilityRole="header"
            className="min-w-0 flex-1 font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
          >
            {application.name}
          </Text>
          <ListingApplicationStatusBadge status={application.status} />
        </View>
        <ListingApplicationInfoCard rows={rows} />
        {application.status === 'supplementRequested' ? (
          <ListingAdminOpinion opinion={application.adminOpinion} />
        ) : (
          <View className="min-h-14 rounded-[10px] bg-motu-bg-secondary px-3.5 py-3">
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
              {application.status === 'reviewing'
                ? '보완 자료를 제출했습니다. 현재 관리자 검토가 진행 중입니다.'
                : '신청서가 접수되었습니다. 검토가 시작되면 상태가 검토중으로 변경됩니다.'}
            </Text>
          </View>
        )}
        {application.status !== 'received' && <View className="min-h-px flex-1" />}
        {application.status === 'supplementRequested' && (
          <Button title="보완 자료 작성" onPress={handleWriteSupplement} />
        )}
        {application.status === 'reviewing' && (
          <Button title="목록으로" variant="secondary" onPress={handleBack} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
