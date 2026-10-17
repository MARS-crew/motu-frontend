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
    <View className="flex-row items-center px-6 py-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        className="h-11 w-11 items-center justify-center active:opacity-60"
      >
        <Image
          source={require('../../assets/icons/topBar/backArrow.svg')}
          contentFit="contain"
          className="mr-2 h-6 w-6"
          accessible={false}
        />
      </Pressable>
      <Text
        accessibilityRole="header"
        className="flex-1 font-pretendard-bold text-[17px] text-motu-black"
      >
        {title}
      </Text>
    </View>
  );
}
