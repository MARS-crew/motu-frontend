import { queryOptions, useQuery } from '@tanstack/react-query';
import { useIsFocused } from 'expo-router';

import { getMyInfo } from '@/apis/user';
import { useAuthStore } from '@/stores/useAuthStore';

export const myInfoQueryOptions = queryOptions({
  queryKey: ['users', 'me'],
  queryFn: ({ signal }) => getMyInfo(signal),
  staleTime: 0,
  gcTime: 0,
  retry: false,
  refetchOnMount: 'always',
  refetchOnWindowFocus: true,
});

export function useMyInfoQuery(isEnabled = true) {
  const isFocused = useIsFocused();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return useQuery({
    ...myInfoQueryOptions,
    enabled: isEnabled && isFocused && isLoggedIn,
  });
}
