import { create } from 'zustand';

import type { SignupConsentInput } from '@/schemas/signupConsentSchema';
import type { SignupInfoForm } from '@/schemas/signupInfoSchema';

type SignupFormState = {
  consent: SignupConsentInput;
  info: SignupInfoForm | null;
  setConsent: (consent: SignupConsentInput) => void;
  setInfo: (info: SignupInfoForm) => void;
  reset: () => void;
};

const INITIAL_CONSENT = { termsAgreed: false, privacyAgreed: false, marketingAgreed: false };

// 사용자가 작성 중인 값만 메모리에서 공유합니다. 비밀번호는 디스크에 저장하지 않습니다.
export const useSignupFormStore = create<SignupFormState>((set) => ({
  consent: INITIAL_CONSENT,
  info: null,
  setConsent: (consent) => set({ consent }),
  setInfo: (info) => set({ info }),
  reset: () => set({ consent: INITIAL_CONSENT, info: null }),
}));
