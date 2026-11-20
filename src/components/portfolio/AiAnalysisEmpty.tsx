import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type AiAnalysisEmptyProps = {
  onInvestPress: () => void;
};

const ANALYSIS_GUIDES = [
  {
    title: 'AI 투자 코치',
    description: 'AI가 나의 투자 성향을 파악하고 조언해줘요.',
    icon: require('../../../assets/icons/portfolio/aiAnalysisCoach.svg'),
  },
  {
    title: 'AI 상품 추천',
    description: 'AI가 내 포트폴리오와 관심 분야를 기반으로 상품을 추천해요.',
    icon: require('../../../assets/icons/portfolio/aiAnalysisRecommendation.svg'),
  },
];

export function AiAnalysisEmpty({ onInvestPress }: AiAnalysisEmptyProps) {
  return (
    <View className="gap-[24px]">
      <View className="items-center rounded-[12px] border border-motu-grey-lighter bg-motu-surface-card px-[17px] py-[32px]">
        <View className="h-[40px] w-[40px] items-center justify-center rounded-full bg-motu-grey-lighter/60">
          <Image
            source={require('../../../assets/icons/portfolio/aiAnalysisEmpty.svg')}
            className="h-[18px] w-[18px]"
            contentFit="contain"
            accessible={false}
          />
        </View>
        <Text className="mt-[16px] text-center font-pretendard-bold text-[14px] leading-[22.75px] text-motu-black text-no-font-padding">
          AI가 분석할 투자 내역이 부족해요.
        </Text>
        <Text className="mt-[8px] text-center font-pretendard text-[12px] leading-[19.5px] text-motu-grey text-no-font-padding">
          더 많은 투자 활동을 통해 AI 분석 결과를 받아보세요.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onInvestPress}
          className="mt-[20px] min-h-[44px] w-full flex-row items-center justify-center gap-[4px] rounded-[8px] border border-motu-grey-lighter px-[16px] active:bg-motu-grey-lighter/40"
        >
          <Text className="font-pretendard-semibold text-[12px] leading-[18px] text-motu-black text-no-font-padding">
            투자하러 가기
          </Text>
          <Image
            source={require('../../../assets/icons/portfolio/aiAnalysisChevron.svg')}
            className="h-[15px] w-[15px]"
            contentFit="contain"
            accessible={false}
          />
        </Pressable>
      </View>
      <View className="gap-[16px]">
        {ANALYSIS_GUIDES.map(({ title, description, icon }) => (
          <View key={title} className="flex-row items-center gap-[12px]">
            <View className="mt-[2px] h-[28px] w-[28px] items-center justify-center rounded-full bg-motu-grey-lighter/60">
              <Image
                source={icon}
                className="h-[14px] w-[14px]"
                contentFit="contain"
                accessible={false}
              />
            </View>
            <View className="flex-1 gap-[4px]">
              <Text className="font-pretendard-bold text-[12px] leading-[18px] text-motu-black text-no-font-padding">
                {title}
              </Text>
              <Text className="font-pretendard text-[11px] leading-[17.875px] text-motu-grey text-no-font-padding">
                {description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
