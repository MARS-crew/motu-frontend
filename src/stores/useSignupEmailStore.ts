import { create } from 'zustand';

type SignupEmailState = {
  email: string;
  setEmail: (email: string) => void;
};

export const useSignupEmailStore = create<SignupEmailState>((set) => ({
  email: '',
  setEmail: (email) => set({ email }),
}));
