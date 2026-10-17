import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type ProductDetailHeaderProps = {
  isFavorite: boolean;
  onBack: () => void;
  onAlertPress: () => void;
  onFavoritePress: () => void;
};

// 뒤로가기 위치는 공용 TopBar와 같고, 오른쪽에 지정가 알림·관심 버튼을 둡니다.
export function ProductDetailHeader({
  isFavorite,
  onBack,
  onAlertPress,
  onFavoritePress,
}: ProductDetailHeaderProps) {
  return (
    <View className="flex-row items-center justify-between pb-4 pl-4 pr-6 pt-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        hitSlop={4}
        className="h-9 w-9 items-center justify-center active:opacity-60"
      >
        <Image
          source={require('../../../assets/icons/topBar/backArrow.svg')}
          contentFit="contain"
          className="h-6 w-6"
        />
      </Pressable>
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="지정가 알림"
          onPress={onAlertPress}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={require('../../../assets/icons/home/bell.svg')}
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? '관심 상품 해제' : '관심 상품 추가'}
          accessibilityState={{ selected: isFavorite }}
          onPress={onFavoritePress}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={
              isFavorite
                ? require('../../../assets/icons/product/heartFilled.svg')
                : require('../../../assets/icons/home/heart.svg')
            }
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
        </Pressable>
      </View>
    </View>
  );
}
