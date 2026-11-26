import { z } from 'zod';

export const twoFactorCodeSchema = z.object({ code: z.string().regex(/^\d{6}$/, '6자리 숫자') });
export type TwoFactorCodeForm = z.infer<typeof twoFactorCodeSchema>;
export const twoFactorDeliverySchema = z.object({
  maskedPhoneNumber: z.string(),
  expiresAt: z.iso.datetime({ offset: true }),
  resendAvailableAt: z.iso.datetime({ offset: true }),
  remainingAttempts: z.number().int().nonnegative(),
});
export type TwoFactorDelivery = z.infer<typeof twoFactorDeliverySchema>;
export const twoFactorSessionSchema = z.object({ verifiedUntil: z.iso.datetime({ offset: true }) });
export const twoFactorIntentSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('order'),
    stockId: z.number().int().positive(),
    side: z.enum(['buy', 'sell']),
  }),
  z.object({
    kind: z.literal('listing'),
    pathname: z.enum([
      '/listing-application',
      '/listing-application/basic-info',
      '/listing-application/trading-info',
      '/listing-application/service-metrics',
      '/listing-application/evidence',
      '/listing-application/review',
    ]),
    draftId: z.string().optional(),
    origin: z
      .enum([
        '/listing-application',
        '/listing-application/my-applications',
        '/listing-application/review',
      ])
      .optional(),
  }),
  z.object({ kind: z.literal('phone-change'), returnIntent: z.string().optional() }),
  z.object({
    kind: z.literal('login'),
    stockId: z.number().int().positive().optional(),
    returnTo: z.literal('/listing-application').optional(),
  }),
]);
export type TwoFactorIntent = z.infer<typeof twoFactorIntentSchema>;
