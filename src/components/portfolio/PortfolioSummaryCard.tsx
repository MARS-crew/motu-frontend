import { Text, View } from 'react-native';

import { getChangeColorClass } from '@/utils/formatNumber';

type PortfolioSummaryCardProps = {
  totalAsset: number;
  cash: number;
  valuation: number;
  profit: number;
  profitRate: number;
  updatedAt: string;
};

const formatPoint = (value: number) => `${value.toLocaleString('ko-KR')} P`;

export function PortfolioSummaryCard({
  totalAsset,
  cash,
  valuation,
  profit,
  profitRate,
  updatedAt,
}: PortfolioSummaryCardProps) {
  const profitColorClassName = getChangeColorClass(profit);
  const profitArrow = profit > 0 ? '▲ ' : profit < 0 ? '▼ ' : '';

  return (
    <View className="rounded-xl border border-motu-grey-lighter bg-white px-[17px] py-[21px]">
      <Text className="font-pretendard text-xs leading-[18px] text-motu-grey">총 자산</Text>
      <Text className="mt-1 font-pretendard-bold text-[26px] leading-[26px] tracking-[-0.52px] text-motu-black">
        {formatPoint(totalAsset)}
      </Text>

      <View className="mt-5 flex-row justify-between">
        <View className="gap-1">
          <Text className="font-pretendard text-[11px] leading-[16.5px] text-motu-grey">
            예수금
          </Text>
          <Text className="font-pretendard-semibold text-[13px] leading-[19.5px] tracking-[-0.26px] text-motu-black">
            {formatPoint(cash)}
          </Text>
        </View>
        <View className="items-end gap-1">
          <Text className="font-pretendard text-[11px] leading-[16.5px] text-motu-grey">
            평가금액
          </Text>
          <Text className="font-pretendard-semibold text-[13px] leading-[19.5px] tracking-[-0.26px] text-motu-black">
            {formatPoint(valuation)}
          </Text>
        </View>
      </View>

      <View className="mt-4 gap-1 border-t border-motu-grey-lighter pt-[17px]">
        <Text className="font-pretendard text-[11px] leading-[16.5px] text-motu-grey">
          평가손익
        </Text>
        <View className="flex-row items-center gap-1.5">
          <Text
            className={`font-pretendard-bold text-[15px] leading-[22.5px] tracking-[-0.3px] ${profitColorClassName}`}
          >
            {formatPoint(profit)}
          </Text>
          <Text className={`font-pretendard-bold text-xs leading-[18px] ${profitColorClassName}`}>
            {`(${profitArrow}${Math.abs(profitRate).toFixed(2)}%)`}
          </Text>
        </View>
      </View>

      <Text className="mt-4 font-pretendard text-[10px] leading-[16.25px] text-motu-grey-light">
        {`기준 시각 ${updatedAt} | 시세 반영은 지연될 수 있습니다.`}
      </Text>
    </View>
  );
}
