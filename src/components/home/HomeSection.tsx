import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type HomeSectionProps = {
  title: string;
  children: ReactNode;
  onMorePress?: () => void;
};

export function HomeSection({ title, children, onMorePress }: HomeSectionProps) {
  return (
    <View className="rounded-2xl border border-motu-grey-lighter bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text
          accessibilityRole="header"
          className="font-inter-bold text-[13px] leading-[18px] text-motu-black"
        >
          {title}
        </Text>
        {onMorePress && (
          <Pressable
            accessibilityRole="button"
            onPress={onMorePress}
            hitSlop={8}
            className="flex-row items-center active:opacity-60"
          >
            <Text className="font-inter-medium text-[11px] leading-[14px] text-motu-grey">
              자세히 보기
            </Text>
            <Image
              source={require('../../../assets/icons/home/chevronRightSmall.svg')}
              contentFit="contain"
              className="h-3.5 w-3.5"
            />
          </Pressable>
        )}
      </View>
      <View className="mt-3">{children}</View>
    </View>
  );
}
