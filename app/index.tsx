import { Redirect } from 'expo-router';

import { useAuthStore } from '@/stores/useAuthStore';

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return <Redirect href={isLoggedIn ? '/(tabs)' : '/(auth)/login'} />;
}
