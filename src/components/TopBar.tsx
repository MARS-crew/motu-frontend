import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type TopBarProps = {
  title: string;
  onBack: () => void;
  variant?: 'default' | 'listing' | 'listing-detail';
  isScrolled?: boolean;
};

// 본문이 스크롤되면 하단 구분선을 보여 고정된 상단바와 본문을 구분합니다.
export function TopBar({ title, onBack, variant = 'default', isScrolled = false }: TopBarProps) {
  const isListing = variant !== 'default';
  return (
    <View
      className={`flex-row items-center border-b bg-motu-bg pt-8 ${isScrolled ? 'border-motu-grey-lighter' : 'border-transparent'} ${isListing ? 'gap-3.5 pb-5' : 'gap-1 pb-4'} ${variant === 'listing' ? 'pl-6 pr-5' : variant === 'listing-detail' ? 'px-5' : 'px-4'}`}
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
