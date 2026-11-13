import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type LoginHeaderProps = {
  onBack: () => void;
};

export function LoginHeader({ onBack }: LoginHeaderProps) {
  return (
    <View className="h-[48px] shrink-0 px-[24px] pb-[8px] pt-[16px]">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        hitSlop={10}
        className="h-[24px] w-[24px]"
      >
        <Image
          source={require('../../../assets/icons/login/backArrow.svg')}
          contentFit="contain"
          className="h-[24px] w-[24px]"
          accessible={false}
        />
      </Pressable>
    </View>
  );
}
