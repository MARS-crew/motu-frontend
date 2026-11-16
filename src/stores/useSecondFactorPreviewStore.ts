import { create } from 'zustand';

type SecondFactorPreviewState = {
  maskedPhone: string | null;
  verifiedAt: number | null;
  failedAttempts: number;
  lockedUntil: number | null;
  register: (maskedPhone: string) => void;
  release: () => void;
  recordFailure: () => void;
};

const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 30 * 60 * 1000;

export const useSecondFactorPreviewStore = create<SecondFactorPreviewState>((set) => ({
  maskedPhone: null,
  verifiedAt: null,
  failedAttempts: 0,
  lockedUntil: null,
  register: (maskedPhone) =>
    set({ maskedPhone, verifiedAt: Date.now(), failedAttempts: 0, lockedUntil: null }),
  release: () => set({ maskedPhone: null, verifiedAt: null, failedAttempts: 0, lockedUntil: null }),
  recordFailure: () =>
    set((state) => {
      const now = Date.now();
      if (state.lockedUntil && state.lockedUntil > now) return state;
      const failedAttempts = state.lockedUntil ? 1 : state.failedAttempts + 1;
      return {
        failedAttempts,
        lockedUntil: failedAttempts >= MAX_ATTEMPTS ? now + LOCK_DURATION_MS : null,
      };
    }),
}));
