import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type LoginHeaderProps = {
  onBack: () => void;
  title?: string;
};

export function LoginHeader({ onBack, title }: LoginHeaderProps) {
  return (
    <View className="h-[48px] shrink-0 flex-row items-center gap-[8px] px-[24px] pb-[8px] pt-[16px]">
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
      {title && (
        <Text className="flex-1 font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding">
          {title}
        </Text>
      )}
    </View>
  );
}
