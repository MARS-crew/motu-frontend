import { z } from 'zod';

export const twoFactorStatusSchema = z.enum(['NOT_SET', 'ENABLED', 'DISABLED']);

export const twoFactorSchema = z.object({
  status: twoFactorStatusSchema,
  maskedPhoneNumber: z.string().nullable(),
  enabledDate: z.iso.datetime({ offset: true }).nullable(),
  lastVerifiedDate: z.iso.datetime({ offset: true }).nullable(),
  verifiedUntil: z.iso.datetime({ offset: true }).nullable(),
  lockedUntil: z.iso.datetime({ offset: true }).nullable(),
  remainingAttempts: z.number().int().nonnegative(),
});

export type TwoFactor = z.infer<typeof twoFactorSchema>;
