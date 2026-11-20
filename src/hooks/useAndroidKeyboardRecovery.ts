import { useEffect, useRef, type RefObject } from 'react';
import { Keyboard, Platform, type TextInput } from 'react-native';

// Android에서 뒤로가기로 키보드만 닫으면 TextInput의 포커스가 남을 수 있습니다.
// 이 상태의 재탭은 focus()만으로 키보드가 다시 열리지 않아 포커스를 갱신합니다.
export function useAndroidKeyboardRecovery(
  inputRef: RefObject<TextInput | null>,
  isEnabled: boolean,
) {
  const frameRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  return () => {
    const input = inputRef.current;
    if (
      Platform.OS !== 'android' ||
      !isEnabled ||
      !input?.isFocused() ||
      Keyboard.isVisible() ||
      frameRef.current !== null
    ) {
      return;
    }

    input.blur();
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      if (inputRef.current === input) input.focus();
    });
  };
}
