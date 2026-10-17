import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { StockSummary } from '@/types/home';
import { formatPoint, formatRate, getChangeColorClass } from '@/utils/formatNumber';

cssInterop(Image, { className: 'style' });

type StockListItemProps = {
  stock: StockSummary;
  onPress?: () => void;
};

export function StockListItem({ stock, onPress }: StockListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-lg border border-motu-grey-lighter px-3.5 py-3 active:opacity-60"
    >
      {/* 종목별 색상은 서버 데이터라 style로 지정합니다. */}
      <View
        className="h-9 w-9 items-center justify-center rounded-full"
        style={{ backgroundColor: stock.color }}
      >
        <Text className="font-inter-bold text-base leading-[22px] text-white">
          {stock.name.charAt(0)}
        </Text>
      </View>
      <View className="flex-1 gap-0.5">
        <Text numberOfLines={1} className="font-inter-bold text-sm leading-[18px] text-motu-black">
          {stock.name}
        </Text>
        {stock.description && (
          <Text
            numberOfLines={1}
            className="font-inter-medium text-[10px] leading-[13px] text-motu-grey"
          >
            {stock.description}
          </Text>
        )}
        {stock.listedAt && (
          <Text className="font-inter-medium text-[10px] leading-[13px] text-motu-grey-light">
            상장일 {stock.listedAt}
          </Text>
        )}
      </View>
      <View className="items-end gap-0.5">
        <Text className="font-inter-bold text-[13px] leading-[18px] text-motu-black">
          {formatPoint(stock.price)}
        </Text>
        <Text
          className={`font-inter-medium text-xs leading-4 ${getChangeColorClass(stock.changeRate)}`}
        >
          {formatRate(stock.changeRate)}
        </Text>
      </View>
      <Image
        source={require('../../../assets/icons/home/chevronRight.svg')}
        contentFit="contain"
        className="h-4 w-4"
      />
    </Pressable>
  );
}
