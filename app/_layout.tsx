import '../global.css';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { queryClient } from '@/queries/queryClient';
import { useAppFonts } from '@/hooks/useAppFonts';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isLoaded, error } = useAppFonts();

  useEffect(() => {
    if (error) console.warn('Pretendard 폰트를 불러오지 못했습니다.', error);
    if (isLoaded || error) SplashScreen.hide();
  }, [isLoaded, error]);

  if (!isLoaded && !error) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
