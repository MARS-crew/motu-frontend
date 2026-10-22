import { Pressable, Text } from 'react-native';

import { SHOW_DEV_TOOLS } from '@/constants/env';
import { useAuthStore } from '@/stores/useAuthStore';

// 개발 모드에서 회원/비회원 화면을 확인하기 위한 버튼입니다.
// 배포 빌드에서는 숨기고, EXPO_PUBLIC_SHOW_DEV_TOOLS=true로 만든 테스트 빌드에서만 보입니다.
export function DevLoginToggle() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setLoggedIn = useAuthStore((state) => state.setLoggedIn);

  if (!SHOW_DEV_TOOLS) return null;

  const handlePress = () => setLoggedIn(!isLoggedIn);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      className="items-center rounded-xl border border-dashed border-motu-grey-light py-3 active:opacity-60"
    >
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey">
        [DEV] {isLoggedIn ? '회원' : '비회원'} 상태 · 눌러서 {isLoggedIn ? '로그아웃' : '로그인'}
      </Text>
    </Pressable>
  );
}
