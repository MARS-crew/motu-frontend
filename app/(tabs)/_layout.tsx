import { Redirect, Tabs } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';

export default function TabsLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: '홈' }} />
    </Tabs>
  );
}
