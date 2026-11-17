import { create } from 'zustand';

type NotificationPreferencesState = {
  isPushEnabled: boolean;
  isNightPushEnabled: boolean;
  togglePush: () => void;
  toggleNightPush: () => void;
};

// 서버 연동 전에는 현재 앱 세션 안에서 설정 화면의 상태를 유지합니다.
export const useNotificationPreferencesStore = create<NotificationPreferencesState>((set) => ({
  isPushEnabled: true,
  isNightPushEnabled: false,
  togglePush: () => set((state) => ({ isPushEnabled: !state.isPushEnabled })),
  toggleNightPush: () =>
    set((state) => {
      if (!state.isPushEnabled) return state;
      return { isNightPushEnabled: !state.isNightPushEnabled };
    }),
}));
