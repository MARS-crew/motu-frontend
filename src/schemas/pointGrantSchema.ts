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
