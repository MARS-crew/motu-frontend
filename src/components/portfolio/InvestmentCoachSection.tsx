import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type InvestmentCoachSectionProps = {
  title: string;
  description: string;
};

export function InvestmentCoachSection({ title, description }: InvestmentCoachSectionProps) {
  return (
    <View className="gap-[8px]">
      <Text
        accessibilityRole="header"
        className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black text-no-font-padding"
      >
        AI 투자 코치
      </Text>
      <View className="flex-row items-start gap-[8px] rounded-[12px] border border-motu-grey-lighter bg-motu-grey-lighter/30 p-[16px]">
        <View className="mt-[2px] h-[24px] w-[24px] items-center justify-center rounded-full bg-motu-black">
          <Image
            source={require('../../../assets/icons/portfolio/aiAnalysisReportCoach.svg')}
            className="h-[13px] w-[13px]"
            contentFit="contain"
            accessible={false}
          />
        </View>
        <View className="flex-1 gap-[8px]">
          <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black text-no-font-padding">
            {title}
          </Text>
          <Text className="font-pretendard text-[12px] leading-[19.5px] text-motu-grey text-no-font-padding">
            {description}
          </Text>
        </View>
      </View>
    </View>
  );
}
