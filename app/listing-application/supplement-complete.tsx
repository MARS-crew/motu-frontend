import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingApplicationInfoCard } from '@/components/listingApplication/ListingApplicationInfoCard';
import { ListingApplicationStatusBadge } from '@/components/listingApplication/ListingApplicationStatusBadge';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function ListingSupplementCompleteScreen() {
  const { applicationId } = useLocalSearchParams<{ applicationId?: string }>();
  const application = useListingDraftStore((state) =>
    applicationId ? state.applications[applicationId] : undefined,
  );
  const handleViewApplications = () => router.dismissTo('/listing-application/my-applications');
  const handleViewDetail = () =>
    router.dismissTo({
      pathname: '/listing-application/application-detail',
      params: { applicationId },
    });
  if (application?.status !== 'reviewing')
    return <Redirect href="/listing-application/my-applications" />;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <View className="h-[76px]" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="self-start">
          <ListingApplicationStatusBadge status={application.status} />
        </View>
        <View className="gap-2.5">
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-[34px] leading-[42px] text-motu-text-primary"
          >
            보완 자료 제출 완료
          </Text>
          <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-secondary">
            보완 자료가 제출되었습니다.
          </Text>
        </View>
        <ListingApplicationInfoCard
          rows={[
            { label: '신청번호', value: application.receiptNumber },
            { label: '현재 상태', value: '검토중' },
          ]}
        />
        <View className="min-h-px flex-1" />
        <View className="gap-3">
          <Button title="내 상장 신청 보기" onPress={handleViewApplications} />
          <Button title="신청 상세 보기" variant="secondary" onPress={handleViewDetail} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
