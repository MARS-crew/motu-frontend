import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import { usePointGrantQuery } from '@/queries/usePointGrantQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { getPointGrantErrorMessage, getPointGrantRemainingSeconds } from '@/utils/pointGrant';

export function usePointGrantStatus() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [isFocused, setIsFocused] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const lastExpiredSnapshot = useRef<number | null>(null);
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      setNow(Date.now());
      return () => setIsFocused(false);
    }, []),
  );
  const query = usePointGrantQuery(isFocused && isLoggedIn);
  const { refetch } = query;
  const status = query.data?.status;
  const remainingSeconds = query.data
    ? getPointGrantRemainingSeconds(query.data.status, query.data.receivedAt, now)
    : 0;

  useEffect(() => {
    if (!isFocused || !isLoggedIn) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        setNow(Date.now());
        void refetch();
      }
    });
    return () => {
      clearInterval(timer);
      subscription.remove();
    };
  }, [isFocused, isLoggedIn, refetch]);

  useEffect(() => {
    if (
      !isFocused ||
      !isLoggedIn ||
      !status ||
      status.available ||
      status.remainingSeconds === 0 ||
      remainingSeconds > 0 ||
      query.isFetching
    )
      return;
    if (lastExpiredSnapshot.current === query.dataUpdatedAt) return;
    lastExpiredSnapshot.current = query.dataUpdatedAt;
    void refetch();
  }, [
    isFocused,
    isLoggedIn,
    status,
    remainingSeconds,
    query.dataUpdatedAt,
    query.isFetching,
    refetch,
  ]);

  const canGrant =
    isLoggedIn &&
    isFocused &&
    query.isSuccess &&
    !query.isFetching &&
    status?.available === true &&
    remainingSeconds === 0;
  const errorMessage = !isLoggedIn
    ? '로그인 후 포인트 지급 정보를 확인해 주세요.'
    : query.isError
      ? getPointGrantErrorMessage(query.error)
      : status && !status.available && remainingSeconds === 0 && !query.isFetching
        ? '현재 포인트 추가 지급 조건을 충족하지 않습니다.'
        : null;
  const handleRefresh = useCallback(() => {
    if (!isLoggedIn || !isFocused) return;
    void refetch();
  }, [isLoggedIn, isFocused, refetch]);
  return {
    status: isLoggedIn ? status : undefined,
    canGrant,
    remainingSeconds,
    errorMessage,
    isFetching: query.isFetching,
    isPending: query.isPending,
    refetch: handleRefresh,
  };
}
