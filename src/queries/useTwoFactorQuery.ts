import { queryOptions, useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { getTwoFactor } from '@/apis/twoFactor';
import { useAuthStore } from '@/stores/useAuthStore';

export const twoFactorQueryOptions = queryOptions({
  queryKey: ['two-factor', 'status'],
  queryFn: ({ signal }) => getTwoFactor(signal),
  staleTime: 0,
  gcTime: 0,
  retry: false,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
});

export function useTwoFactorQuery() {
  const isFocused = useIsFocused();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery({
    ...twoFactorQueryOptions,
    enabled: isFocused && isLoggedIn,
  });
}
