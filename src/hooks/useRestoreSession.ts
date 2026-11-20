import { useEffect, useState } from 'react';

import { clearAuthSession, refreshSession } from '@/apis/instance';
import { useAuthStore } from '@/stores/useAuthStore';
import { tokenStorage } from '@/utils/tokenStorage';

export function useRestoreSession() {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    let isActive = true;
    const restore = async () => {
      try {
        const revision = tokenStorage.getRevision();
        const refreshToken = await tokenStorage.getRefreshToken();
        if (revision !== tokenStorage.getRevision()) return;
        if (!refreshToken) {
          const accessToken = await tokenStorage.getAccessToken();
          if (accessToken && revision === tokenStorage.getRevision()) await clearAuthSession();
          return;
        }
        // 토큰의 존재만으로 로그인하지 않고 서버에서 세션을 확인하고 교체합니다.
        const session = await refreshSession();
        if (isActive && session.sessionRevision === tokenStorage.getRevision()) {
          useAuthStore.getState().setLoggedIn(true);
        }
      } catch {
        // 통신 장애 시 토큰은 보존하고 이번 진입은 비로그인 상태로 둡니다.
      } finally {
        if (isActive) setIsReady(true);
      }
    };
    void restore();
    return () => {
      isActive = false;
    };
  }, []);
  return isReady;
}
