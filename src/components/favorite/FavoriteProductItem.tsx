import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { Product } from '@/types/product';
import { formatPoint, formatRate, getChangeColorClass } from '@/utils/formatNumber';

cssInterop(Image, { className: 'style' });

type FavoriteProductItemProps = {
  product: Product;
  onPress?: () => void;
  onFavoritePress: () => void;
};

export function FavoriteProductItem({
  product,
  onPress,
  onFavoritePress,
}: FavoriteProductItemProps) {
  return (
    <View className="flex-row items-center gap-3 rounded-2xl border border-motu-grey-lighter bg-white p-3.5">
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="flex-1 flex-row items-center gap-3 active:opacity-60"
      >
        {/* 종목별 색상은 서버 데이터라 style로 지정합니다. 한글 첫 글자가 위로 치우쳐 보여서 위 패딩을 더 줍니다. */}
        <View
          className="h-11 w-11 items-center justify-center rounded-full pt-[1.5px]"
          style={{ backgroundColor: product.color }}
        >
          <Text className="font-pretendard-bold text-base leading-4 text-white">
            {product.name.charAt(0)}
          </Text>
        </View>
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="font-pretendard-semibold text-sm leading-[21px] text-motu-black"
          >
            {product.name}
          </Text>
          <Text
            numberOfLines={1}
            className="mt-0.5 font-pretendard text-[11.5px] leading-[17.25px] text-motu-grey"
          >
            {product.category}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-pretendard-semibold text-[13px] leading-[19.5px] text-motu-black">
            {formatPoint(product.price)}
          </Text>
          <Text
            className={`mt-0.5 font-pretendard-semibold text-[11.5px] leading-[17.25px] ${getChangeColorClass(product.changeRate)}`}
          >
            {formatRate(product.changeRate)}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${product.name} 관심 상품 해제`}
        onPress={onFavoritePress}
        hitSlop={8}
        className="ml-0.5 h-[19px] w-9 items-center justify-center active:opacity-60"
      >
        <Image
          source={require('../../../assets/icons/favorite/heartFilled.svg')}
          contentFit="contain"
          className="h-[19px] w-[19px]"
        />
      </Pressable>
    </View>
  );
}
