import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable } from 'react-native';

cssInterop(Image, { className: 'style' });

type ScrollToTopButtonProps = {
  onPress: () => void;
};

// 스크롤 영역 우측 하단에 떠 있는 맨 위로 이동 버튼입니다. 위치는 부모 화면에서 잡아 줍니다.
export function ScrollToTopButton({ onPress }: ScrollToTopButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="맨 위로 이동"
      onPress={onPress}
      hitSlop={6}
      className="h-11 w-11 items-center justify-center rounded-full border border-motu-grey-lighter bg-white shadow-floating-button active:opacity-70"
    >
      <Image
        source={require('../../assets/icons/market/arrowUp.svg')}
        contentFit="contain"
        className="h-5 w-5"
      />
    </Pressable>
  );
}
