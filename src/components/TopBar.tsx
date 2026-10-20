import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type TopBarProps = {
  title: string;
  onBack: () => void;
  variant?: 'default' | 'listing';
};

export function TopBar({ title, onBack, variant = 'default' }: TopBarProps) {
  const isListing = variant === 'listing';
  return (
    <View
      className={`flex-row items-center pt-8 ${isListing ? 'gap-3.5 pb-5 pl-6 pr-5' : 'gap-1 px-4 pb-4'}`}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="뒤로가기"
        onPress={onBack}
        hitSlop={isListing ? 10 : 4}
        className={`items-center justify-center active:opacity-60 ${isListing ? 'h-6 w-6' : 'h-9 w-9'}`}
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
        className={`flex-1 font-pretendard-bold ${isListing ? 'text-lg leading-6 text-motu-text-primary' : 'text-[17px] leading-[25.5px] text-motu-black'}`}
      >
        {title}
      </Text>
    </View>
  );
}
