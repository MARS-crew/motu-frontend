import { Redirect, Stack, useSegments } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const segments = useSegments();
  const isPasswordReset = segments[segments.length - 1] === 'new-password';

  // 메일의 일회용 링크는 기존 로그인 세션이 있어도 검증·사용할 수 있어야 합니다.
  if (isLoggedIn && !isPasswordReset) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
