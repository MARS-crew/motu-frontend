import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type TabHeaderProps = {
  title: string;
  onSearchPress: () => void;
  onFavoritePress: () => void;
  isScrolled?: boolean;
};

// 하단 탭 화면이라 뒤로가기 없이 제목을 다른 탭 화면과 같은 위치(좌측 24px)에 둡니다.
export function TabHeader({
  title,
  onSearchPress,
  onFavoritePress,
  isScrolled = false,
}: TabHeaderProps) {
  return (
    <View
      className={`flex-row items-center border-b bg-motu-bg px-6 pb-4 pt-8 ${isScrolled ? 'border-motu-grey-lighter' : 'border-transparent'}`}
    >
      <Text
        accessibilityRole="header"
        className="flex-1 font-pretendard-bold text-[17px] leading-[25.5px] text-motu-black"
      >
        {title}
      </Text>
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="검색"
          onPress={onSearchPress}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={require('../../assets/icons/home/search.svg')}
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="관심 목록"
          onPress={onFavoritePress}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={require('../../assets/icons/home/heart.svg')}
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
        </Pressable>
      </View>
    </View>
  );
}
