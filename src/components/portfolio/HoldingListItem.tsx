import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

import type { Holding } from '@/types/portfolio';
import { formatRate, getChangeColorClass } from '@/utils/formatNumber';

cssInterop(Image, { className: 'style' });

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
      {/* 로고가 없으면 이름 첫 글자를 보여줍니다. */}
      {holding.logoImageUrl ? (
        <Image
          source={{ uri: holding.logoImageUrl }}
          contentFit="cover"
          className="h-9 w-9 rounded-full"
        />
      ) : (
        <View className="h-9 w-9 items-center justify-center rounded-full bg-motu-black">
          <Text className="font-pretendard-bold text-[13px] leading-[13px] text-white">
            {holding.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
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
