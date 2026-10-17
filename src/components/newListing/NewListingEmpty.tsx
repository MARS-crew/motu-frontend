import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

export function NewListingEmpty() {
  return (
    <View className="items-center px-6 pt-[108px]">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-grey-lighter/70">
        <Image
          source={require('../../../assets/icons/newListing/sparkle.svg')}
          contentFit="contain"
          className="h-6 w-6"
        />
      </View>
      <Text className="mt-4 text-center font-pretendard-semibold text-[13.5px] leading-[20.25px] text-motu-black">
        신규 상장 상품이 없습니다.
      </Text>
      <Text className="mt-1.5 text-center font-pretendard text-xs leading-[18px] text-motu-grey">
        새로운 상품의 상장을 기대해 주세요.
      </Text>
    </View>
  );
}
