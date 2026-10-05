import { create } from 'zustand';

type AuthState = {
  isLoggedIn: boolean;
  setLoggedIn: (isLoggedIn: boolean) => void;
};

// 토큰은 여기에 저장하지 않습니다. (tokenStorage 사용)
export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  setLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));
