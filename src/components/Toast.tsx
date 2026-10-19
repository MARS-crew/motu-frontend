import { useEffect } from 'react';
import { Text, View } from 'react-native';

type ToastProps = {
  message: string | null;
  onHide: () => void;
  durationMs?: number;
};

const DEFAULT_TOAST_DURATION_MS = 2000;

// 화면 하단에 잠깐 표시되는 안내 문구입니다. 부모 화면에서 하단 버튼 위로 위치를 잡아 줍니다.
export function Toast({ message, onHide, durationMs = DEFAULT_TOAST_DURATION_MS }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onHide, durationMs);
    return () => clearTimeout(timer);
  }, [message, onHide, durationMs]);

  if (!message) return null;

  return (
    <View pointerEvents="none" accessibilityLiveRegion="polite" className="items-center px-6">
      <View className="rounded-xl bg-motu-black/90 px-4 py-3">
        <Text className="text-center font-pretendard-medium text-[13px] leading-[18px] text-white">
          {message}
        </Text>
      </View>
    </View>
  );
}
