import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { Product } from '@/types/product';
import { formatPoint, formatRate, getChangeColorClass } from '@/utils/formatNumber';

cssInterop(Image, { className: 'style' });

type ProductListItemProps = {
  product: Product;
  rank?: number;
  onPress?: () => void;
  onFavoritePress: () => void;
};

export function ProductListItem({ product, rank, onPress, onFavoritePress }: ProductListItemProps) {
  return (
    <View className="h-[65px] flex-row items-center py-3">
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="flex-1 flex-row items-center active:opacity-60"
      >
        {rank !== undefined && (
          <Text className="mr-4 w-4 text-center font-inter-bold text-[13px] leading-[18px] text-motu-grey">
            {rank}
          </Text>
        )}
        {/* 종목별 색상은 서버 데이터라 style로 지정합니다. */}
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: product.color }}
        >
          <Text className="font-inter-bold text-[15px] leading-5 text-white">
            {product.name.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="font-inter-bold text-sm leading-[18px] text-motu-black"
          >
            {product.name}
          </Text>
          <View className="mt-1 flex-row items-center gap-1.5">
            <Text className="font-inter-medium text-xs leading-4 text-motu-grey">
              {formatPoint(product.price)}
            </Text>
            <Text
              className={`font-inter-medium text-xs leading-4 ${getChangeColorClass(product.changeRate)}`}
            >
              {formatRate(product.changeRate)}
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={product.isFavorite ? '관심 상품 해제' : '관심 상품 추가'}
        accessibilityState={{ selected: product.isFavorite }}
        onPress={onFavoritePress}
        className="ml-2 h-8 w-8 items-center justify-center rounded-full active:opacity-60"
      >
        <Image
          source={
            product.isFavorite
              ? require('../../assets/icons/product/heartFilled.svg')
              : require('../../assets/icons/product/heartOutline.svg')
          }
          contentFit="contain"
          className="h-[18px] w-[18px]"
        />
      </Pressable>
    </View>
  );
}
