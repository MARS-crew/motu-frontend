import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LISTING_RECEIPT_NUMBER_PREVIEW } from '@/constants/listingSubmissionPreview';
import { listingSubmissionSchema } from '@/schemas/listingSubmissionSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

export default function ListingCompleteScreen() {
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const draft = useListingDraftStore((state) => (draftId ? state.drafts[draftId] : undefined));
  const handleViewApplications = () => router.dismissTo('/listing-application');
  const handleNewApplication = () => router.replace('/listing-application/basic-info');

  if (!draft) return <Redirect href="/listing-application" />;
  if (!listingSubmissionSchema.safeParse(draft).success) {
    return <Redirect href={{ pathname: '/listing-application/review', params: { draftId } }} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <View className="h-[76px]" />
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="min-w-[51px] items-center self-start rounded-full bg-motu-success-light px-3.5 py-1.5">
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-success">접수</Text>
        </View>
        <View className="gap-2.5">
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-[34px] leading-[42px] text-motu-text-primary"
          >
            상장 신청 완료
          </Text>
          <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-secondary">
            신청서가 접수되었습니다.
          </Text>
        </View>
        <View className="gap-3 rounded-[14px] border border-motu-border bg-white px-4 py-[15px]">
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary">
              신청번호
            </Text>
            <Text className="font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
              {LISTING_RECEIPT_NUMBER_PREVIEW}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="flex-1 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary">
              현재 상태
            </Text>
            <Text className="font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
              접수
            </Text>
          </View>
        </View>
        <View className="min-h-px flex-1" />
        <View className="gap-3">
          <Button title="내 상장 신청 보기" onPress={handleViewApplications} />
          <Button title="새 상장 신청" variant="secondary" onPress={handleNewApplication} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
