import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AiAnalysisEmpty } from '@/components/portfolio/AiAnalysisEmpty';
import { InvestmentProfileCard } from '@/components/portfolio/InvestmentProfileCard';

cssInterop(Image, { className: 'style' });

const REPORT_PREVIEWS = {
  result: { title: '수익 추구형', description: 'AI·플랫폼 상품 선호도가 높아요' },
  pending: {
    title: '분석 준비 중',
    description: '체결 주문이 10건 이상이면 투자 성향을 분석해요. (현재 4건)',
  },
};

export default function AiAnalysisScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const report =
    __DEV__ && (preview === 'result' || preview === 'pending') ? REPORT_PREVIEWS[preview] : null;

  const handleBack = () => router.dismissTo('/portfolio');
  const handleInvestPress = () => router.dismissTo('/market');

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
            <InvestmentProfileCard {...report} />
          ) : (
            <AiAnalysisEmpty onInvestPress={handleInvestPress} />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
