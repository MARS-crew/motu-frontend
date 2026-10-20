import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { ListingApplicationStatusBadge } from '@/components/listingApplication/ListingApplicationStatusBadge';
import { useListingDraftStore } from '@/stores/useListingDraftStore';
import { getListingEvidenceSummary } from '@/utils/listingApplication';

export default function ListingApplicationDetailScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const application = useListingDraftStore((state) =>
    applicationId ? state.applications[applicationId] : undefined,
  );
  const handleBack = () => router.dismissTo('/listing-application/my-applications');

  if (!application || application.status !== 'received') {
    return <Redirect href="/listing-application/my-applications" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="신청 상세" variant="listing-detail" onBack={handleBack} />
      <ScrollView
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
        <View className="gap-3 rounded-[14px] border border-motu-border bg-white px-[15px] py-[15px]">
          <View className="flex-row items-center gap-2">
            <Text className="shrink-0 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary">
              제출일시
            </Text>
            <Text className="flex-1 text-right font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
              {application.submittedAt}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="shrink-0 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary">
              증빙 파일
            </Text>
            <Text
              numberOfLines={2}
              className="flex-1 text-right font-pretendard-bold text-[15px] leading-5 text-motu-text-primary"
            >
              {getListingEvidenceSummary(application.evidenceItems)}
            </Text>
          </View>
        </View>
        <View className="rounded-[10px] bg-motu-bg-secondary px-3.5 py-3">
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
            신청서가 접수되었습니다. 검토가 시작되면 상태가 검토중으로 변경됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
