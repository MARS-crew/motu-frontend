import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type HomeHeaderProps = {
  hasUnreadNotification: boolean;
  onSearchPress: () => void;
};

export function HomeHeader({ hasUnreadNotification, onSearchPress }: HomeHeaderProps) {
  return (
    <View className="h-20 flex-row items-center justify-between px-6 pb-3 pt-8">
      <Text accessibilityRole="header" className="font-inter-bold text-lg text-motu-black">
        모투
      </Text>
      <View className="flex-row gap-0.5">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="검색"
          onPress={onSearchPress}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={require('../../../assets/icons/home/search.svg')}
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="관심 목록"
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={require('../../../assets/icons/home/heart.svg')}
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hasUnreadNotification ? '알림, 새 알림 있음' : '알림'}
          className="h-9 w-9 items-center justify-center rounded-full active:opacity-60"
        >
          <Image
            source={require('../../../assets/icons/home/bell.svg')}
            contentFit="contain"
            className="h-[21px] w-[21px]"
          />
          {hasUnreadNotification && (
            <View className="absolute left-[22px] top-2 h-1.5 w-1.5 rounded-full bg-motu-red" />
          )}
        </Pressable>
      </View>
    </View>
  );
}
