import { z } from 'zod';

export const pointGrantStatusSchema = z.object({
  cash: z.number().int().nonnegative(),
  amount: z.number().int().positive(),
  available: z.boolean(),
  nextAvailableAt: z.iso.datetime({ offset: true }).nullable(),
  remainingSeconds: z.number().int().nonnegative(),
  lastGrantedAt: z.iso.datetime({ offset: true }).nullable(),
});

export type PointGrantStatus = z.infer<typeof pointGrantStatusSchema>;

export const pointGrantResultSchema = z.object({
  amount: z.number().int().positive(),
  cashBefore: z.number().int().nonnegative(),
  cashAfter: z.number().int().nonnegative(),
  grantedAt: z.iso.datetime({ offset: true }),
  nextAvailableAt: z.iso.datetime({ offset: true }),
});

export type PointGrantResult = z.infer<typeof pointGrantResultSchema>;
