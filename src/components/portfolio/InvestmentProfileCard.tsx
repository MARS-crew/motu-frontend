import { Text, View } from 'react-native';

type InvestmentProfileCardProps = {
  title: string;
  description: string;
};

export function InvestmentProfileCard({ title, description }: InvestmentProfileCardProps) {
  return (
    <View className="rounded-[12px] border border-motu-grey-lighter bg-motu-surface-card px-[16px] py-[20px]">
      <Text className="font-pretendard text-[12px] leading-[18px] text-motu-grey text-no-font-padding">
        나의 투자 성향
      </Text>
      <Text className="mt-[4px] font-pretendard-bold text-[20px] leading-[25px] text-motu-black text-no-font-padding">
        {title}
      </Text>
      <Text className="mt-[8px] font-pretendard text-[12px] leading-[19.5px] text-motu-grey text-no-font-padding">
        {description}
      </Text>
    </View>
  );
}
