import { z } from 'zod';

export const signupConsentSchema = z.object({
  termsAgreed: z.literal(true),
  privacyAgreed: z.literal(true),
  marketingAgreed: z.boolean(),
});
export type SignupConsent = z.infer<typeof signupConsentSchema>;
export type SignupConsentInput = {
  termsAgreed: boolean;
  privacyAgreed: boolean;
  marketingAgreed: boolean;
};
