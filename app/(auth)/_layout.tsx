import { Redirect, Stack } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';

export default function AuthLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
