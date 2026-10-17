import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

export function FavoriteEmpty() {
  return (
    <View className="items-center gap-3 px-8 pt-[104px]">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-grey-lighter/60">
        <Image
          source={require('../../../assets/icons/favorite/heartEmpty.svg')}
          contentFit="contain"
          className="h-6 w-6"
        />
      </View>
      <Text className="text-center font-pretendard-semibold text-[13px] leading-[19.5px] text-motu-black">
        관심 상품이 없습니다.
      </Text>
      <Text className="text-center font-pretendard text-xs leading-[19.5px] text-motu-grey">
        상품 목록에서 관심 상품을 추가해 보세요.
      </Text>
    </View>
  );
}
