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
        {/* 두 자리 순위도 한 줄에 들어가도록 너비를 넓히고, 늘린 만큼 오른쪽 간격을 줄여 위치를 유지합니다. */}
        {rank !== undefined && (
          <Text
            numberOfLines={1}
            className="mr-2 w-6 text-center font-pretendard-bold text-[13px] leading-[18px] text-motu-grey"
          >
            {rank}
          </Text>
        )}
        {/* 종목별 색상은 서버 데이터라 style로 지정합니다. */}
        <View
          className="mr-3 h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: product.color }}
        >
          <Text className="font-pretendard-bold text-[15px] leading-5 text-white">
            {product.name.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          {/* 이름이 길면 이름을 말줄임하고 카테고리는 끝까지 보이게 합니다. */}
          <View className="flex-row items-center gap-1.5">
            <Text
              numberOfLines={1}
              className="flex-shrink font-pretendard-bold text-sm leading-[18px] text-motu-black"
            >
              {product.name}
            </Text>
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
              {product.category}
            </Text>
          </View>
          <View className="mt-1 flex-row items-center gap-1.5">
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey">
              {formatPoint(product.price)}
            </Text>
            <Text
              className={`font-pretendard-medium text-xs leading-4 ${getChangeColorClass(product.changeRate)}`}
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
