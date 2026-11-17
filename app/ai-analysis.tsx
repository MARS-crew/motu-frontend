import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AiAnalysisEmpty } from '@/components/portfolio/AiAnalysisEmpty';
import { AiRecommendationSection } from '@/components/portfolio/AiRecommendationSection';
import { InvestmentCoachSection } from '@/components/portfolio/InvestmentCoachSection';
import { InvestmentProfileCard } from '@/components/portfolio/InvestmentProfileCard';
import { AI_ANALYSIS_PREVIEWS, AI_RECOMMENDATION_PREVIEW } from '@/constants/aiAnalysisPreview';

cssInterop(Image, { className: 'style' });

export default function AiAnalysisScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const report =
    __DEV__ &&
    (preview === 'result' || preview === 'medium' || preview === 'low' || preview === 'pending')
      ? AI_ANALYSIS_PREVIEWS[preview]
      : null;

  const handleBack = () => router.dismissTo('/portfolio');
  const handleInvestPress = () => router.dismissTo('/market');
  const handleProductPress = (keyword: string) =>
    router.push({ pathname: '/search', params: { keyword } });

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <View className="mx-auto w-full max-w-[393px] flex-1">
        <View className="shrink-0 flex-row items-center gap-[8px] pb-[16px] pl-[14px] pr-[24px] pt-[32px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            onPress={handleBack}
            hitSlop={4}
            className="h-[36px] w-[36px] items-center justify-center rounded-full active:opacity-60"
          >
            <Image
              source={require('../assets/icons/my/security/back.svg')}
              className="h-[24px] w-[24px]"
              contentFit="contain"
              accessible={false}
            />
          </Pressable>
          <Text
            accessibilityRole="header"
            className="flex-1 font-pretendard-bold text-[17px] leading-[25.5px] text-motu-black text-no-font-padding"
          >
            AI 분석
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-[24px] pb-[32px] pt-[8px]"
          showsVerticalScrollIndicator={false}
        >
          {report ? (
            <View className="gap-[24px]">
              <InvestmentProfileCard {...report.profile} />
              <InvestmentCoachSection {...report.coach} />
              <AiRecommendationSection
                products={AI_RECOMMENDATION_PREVIEW}
                onProductPress={handleProductPress}
              />
            </View>
          ) : (
            <AiAnalysisEmpty onInvestPress={handleInvestPress} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
