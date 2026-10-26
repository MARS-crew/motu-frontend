import { Redirect, Stack, useSegments } from 'expo-router';

import { useListingAccess } from '@/hooks/useListingAccess';

const EDIT_ROUTES = new Set([
  'basic-info',
  'trading-info',
  'service-metrics',
  'evidence',
  'review',
  'supplement',
  'supplement-evidence',
]);

export default function ListingApplicationLayout() {
  const segments = useSegments();
  const isEditRoute = EDIT_ROUTES.has(segments[segments.length - 1]);
  const access = useListingAccess(isEditRoute);

  // 진입 버튼 외에도 직접 URL로 작성 화면에 접근하는 경우를 검사합니다.
  if (isEditRoute) {
    if (!access.isLoggedIn) return <Redirect href="/(auth)/login" />;
    if (access.restriction) return <Redirect href="/listing-application" />;
    // 정상 확인 이후의 백그라운드 재조회가 작성 중인 폼을 언마운트하지 않게 합니다.
    if (!access.hasChecked) {
      if (access.isChecking) return null;
      return <Redirect href="/listing-application" />;
    }
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
