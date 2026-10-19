import { Image } from 'expo-image';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ListingReviewSummary } from '@/components/listingApplication/ListingReviewSummary';
import { listingSubmissionSchema } from '@/schemas/listingSubmissionSchema';
import { useListingDraftStore } from '@/stores/useListingDraftStore';

cssInterop(Image, { className: 'style' });

export default function ListingReviewScreen() {
  const { draftId } = useLocalSearchParams<{ draftId?: string }>();
  const draft = useListingDraftStore((state) => (draftId ? state.drafts[draftId] : undefined));
  const steps = [
    {
      title: '기본 정보',
      isComplete: listingSubmissionSchema.shape.values.safeParse(draft?.values).success,
    },
    {
      title: '평가·거래 정보',
      isComplete: listingSubmissionSchema.shape.tradingValues.safeParse(draft?.tradingValues)
        .success,
    },
    {
      title: '서비스 지표',
      isComplete: listingSubmissionSchema.shape.metricsValues.safeParse(draft?.metricsValues)
        .success,
    },
    {
      title: '증빙 자료',
      isComplete: listingSubmissionSchema.shape.evidenceValues.safeParse(draft?.evidenceValues)
        .success,
    },
  ];
  const canSubmit = listingSubmissionSchema.safeParse(draft).success;
  const handleBack = () => {
    router.dismissTo({ pathname: '/listing-application/evidence', params: { draftId } });
  };
  const handleSubmit = () => {
    if (!canSubmit) return;
    // 퍼블리싱용 이동입니다. 실제 접수 API 및 2차 보안 인증은 서버 연동 시 연결합니다.
    router.replace({ pathname: '/listing-application/complete', params: { draftId } });
  };

  if (!draft) return <Redirect href="/listing-application" />;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <View className="h-[76px] justify-center px-5 pb-5 pt-8">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          onPress={handleBack}
          hitSlop={10}
          className="self-start active:opacity-60"
        >
          <Image
            source={require('../../assets/icons/listingApplication/form/backArrow.svg')}
            className="h-6 w-6"
            contentFit="contain"
          />
        </Pressable>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow gap-5 px-6 pb-7 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
        >
          최종 확인
        </Text>
        <View className="gap-1.5">
          <Text className="font-pretendard-bold text-lg leading-6 text-motu-text-primary">
            입력 내용을 확인해 주세요.
          </Text>
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
            모든 필수 항목이 완료되어야 제출할 수 있습니다.
          </Text>
        </View>
        <ListingReviewSummary steps={steps} />
        <View className="min-h-px flex-1" />
        <View className="gap-2.5">
          <View className="rounded-[10px] bg-motu-bg-secondary px-3.5 py-3">
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
              최종 제출 시 2차 보안 인증 상태를 확인합니다. 미인증·만료 상태이면 인증 완료 후
              접수됩니다.
            </Text>
          </View>
          <Button title="최종 제출" onPress={handleSubmit} disabled={!canSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
