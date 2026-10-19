import { Text, View } from 'react-native';

import type { Holding } from '@/types/portfolio';
import { formatRate, getChangeColorClass } from '@/utils/formatNumber';

type HoldingListItemProps = {
  holding: Holding;
  isFirst: boolean;
};

export function HoldingListItem({ holding, isFirst }: HoldingListItemProps) {
  return (
    <View
      className={`flex-row items-center gap-3 px-4 py-3 ${
        isFirst ? '' : 'border-t border-motu-grey-lighter'
      }`}
    >
      {/* 종목별 색상은 서버 데이터라 style로 지정합니다. */}
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: holding.color }}
      >
        <Text className="font-pretendard-bold text-[13px] leading-[13px] text-white">
          {holding.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        className="flex-1 font-pretendard-semibold text-[13px] leading-[19.5px] text-motu-black"
      >
        {holding.name}
      </Text>
      <View className="items-end gap-0.5">
        <Text className="font-pretendard-semibold text-xs leading-[18px] tracking-[-0.24px] text-motu-black">
          {`${holding.valuation.toLocaleString('ko-KR')} P`}
        </Text>
        <Text
          className={`font-pretendard-semibold text-[11px] leading-[16.5px] ${getChangeColorClass(
            holding.returnRate,
          )}`}
        >
          {formatRate(holding.returnRate)}
        </Text>
      </View>
    </View>
  );
}
