import { useCallback, useState } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

// 고정된 상단바 아래로 본문이 스크롤됐는지 추적합니다. 값이 바뀔 때만 다시 그려지도록 boolean으로 저장합니다.
export function useHeaderScroll() {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(event.nativeEvent.contentOffset.y > 0);
  }, []);

  return { isScrolled, handleScroll };
}
