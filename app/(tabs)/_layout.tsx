import { Redirect, Tabs } from 'expo-router';

import { BottomTabBar } from '@/components/BottomTabBar';
import { useAuthStore } from '@/stores/useAuthStore';

export default function TabsLayout() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (!__DEV__ && !isLoggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      tabBar={(props) =>
        props.state.routes[props.state.index].name === 'asset-management' ? null : (
          <BottomTabBar {...props} />
        )
      }
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="market" options={{ title: '마켓' }} />
      <Tabs.Screen name="portfolio" options={{ title: '포트폴리오' }} />
      <Tabs.Screen name="transactions" options={{ title: '거래내역' }} />
      <Tabs.Screen name="asset-management" options={{ href: null }} />
      <Tabs.Screen name="my" options={{ title: '마이' }} />
    </Tabs>
  );
}
