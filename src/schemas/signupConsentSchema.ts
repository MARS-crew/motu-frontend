import { z } from 'zod';

const signupConsentInputSchema = z.object({
  termsAgreed: z.boolean(),
  privacyAgreed: z.boolean(),
  marketingAgreed: z.boolean(),
});
export const signupConsentSchema = signupConsentInputSchema.extend({
  termsAgreed: z.literal(true),
  privacyAgreed: z.literal(true),
  marketingAgreed: z.boolean(),
});
export type SignupConsent = z.infer<typeof signupConsentSchema>;
export type SignupConsentInput = z.infer<typeof signupConsentInputSchema>;
