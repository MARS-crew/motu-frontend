import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type TopBarProps = {
  title: string;
  onBack: () => void;
};

export function TopBar({ title, onBack }: TopBarProps) {
  return (
    <View className="flex-row items-center gap-1 px-4 pb-4 pt-8">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        hitSlop={4}
        className="h-9 w-9 items-center justify-center active:opacity-60"
      >
        <Image
          source={require('../../assets/icons/topBar/backArrow.svg')}
          contentFit="contain"
          className="h-6 w-6"
          accessible={false}
        />
      </Pressable>
      <Text
        accessibilityRole="header"
        className="flex-1 font-pretendard-bold text-[17px] leading-[25.5px] text-motu-black"
      >
        {title}
      </Text>
    </View>
  );
}
