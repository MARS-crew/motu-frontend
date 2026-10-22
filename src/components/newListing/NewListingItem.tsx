import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { NewListing } from '@/types/newListing';
import { formatRate, getChangeColorClass } from '@/utils/formatNumber';

cssInterop(Image, { className: 'style' });

type NewListingItemProps = {
  listing: NewListing;
  onPress?: () => void;
  onFavoritePress: () => void;
};

export function NewListingItem({ listing, onPress, onFavoritePress }: NewListingItemProps) {
  return (
    <View className="h-[86px] flex-row items-center gap-3 rounded-xl border border-motu-grey-lighter bg-white px-3.5">
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        className="flex-1 flex-row items-center gap-3 active:opacity-60"
      >
        <View>
          {/* 종목별 색상은 서버 데이터라 style로 지정합니다. */}
          <View
            className="h-11 w-11 items-center justify-center rounded-full"
            style={{ backgroundColor: listing.color }}
          >
            <Text className="font-pretendard-bold text-base leading-[22px] text-white">
              {listing.name.charAt(0)}
            </Text>
          </View>
          {/* 칩은 높이를 고정하고 글자 위아래 여백(font padding)을 없애, 플랫폼과 관계없이 위아래 여백을 같게 맞춥니다. */}
          {listing.isNew && (
            <View className="absolute -left-1.5 -top-1.5 h-4 justify-center rounded-full bg-motu-green px-1.5 shadow">
              <Text className="font-pretendard-semibold text-[11px] leading-[14px] text-white text-no-font-padding text-vertical-center">
                New
              </Text>
            </View>
          )}
        </View>
        <View className="flex-1">
          <Text
            numberOfLines={1}
            className="font-pretendard-bold text-sm leading-[21px] text-motu-black"
          >
            {listing.name}
          </Text>
          <Text
            numberOfLines={1}
            className="mt-0.5 font-pretendard-medium text-[11px] leading-[17.25px] text-motu-grey"
          >
            {listing.description}
          </Text>
          <Text className="mt-1 font-pretendard-medium text-[11px] leading-[15.75px] text-motu-grey-light">
            상장일: {listing.listedAt}
          </Text>
        </View>
        <View className="items-end">
          <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black">
            {listing.price.toLocaleString('ko-KR')}P
          </Text>
          <Text
            className={`mt-0.5 font-pretendard-medium text-xs leading-[18px] ${getChangeColorClass(listing.changeRate)}`}
          >
            {formatRate(listing.changeRate)}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={listing.isFavorite ? '관심 상품 해제' : '관심 상품 추가'}
        accessibilityState={{ selected: listing.isFavorite }}
        onPress={onFavoritePress}
        className="h-8 w-8 items-center justify-center rounded-full active:opacity-60"
      >
        <Image
          source={
            listing.isFavorite
              ? require('../../../assets/icons/product/heartFilled.svg')
              : require('../../../assets/icons/product/heartOutline.svg')
          }
          contentFit="contain"
          className="h-[18px] w-[18px]"
        />
      </Pressable>
    </View>
  );
}
