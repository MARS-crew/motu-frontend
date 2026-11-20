import { z } from 'zod';

export const verificationDeliverySchema = z.object({
  expiresAt: z.iso.datetime(),
  resendAvailableAt: z.iso.datetime(),
});
export const loginVerificationDeliverySchema = verificationDeliverySchema.extend({
  method: z.enum(['EMAIL', 'SMS']),
  maskedTarget: z.string(),
  remainingAttempts: z.number().int().nonnegative().nullable(),
});
