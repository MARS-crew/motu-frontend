import { z } from 'zod';

export const pointResetConditionSchema = z.object({
  condition: z.string(),
  met: z.boolean(),
  message: z.string().optional(),
});

export const pointResetStatusSchema = z.object({
  resetCash: z.number().int().positive(),
  cash: z.number().int().nonnegative(),
  available: z.boolean(),
  reason: z.string().nullable(),
  conditions: z.array(pointResetConditionSchema),
  nextAvailableAt: z.iso.datetime({ offset: true }).nullable(),
  remainingSeconds: z.number().int().nonnegative(),
});

export const pointResetResultSchema = z.object({
  cashBefore: z.number().int().nonnegative(),
  cashAfter: z.number().int().nonnegative(),
  resetAt: z.iso.datetime({ offset: true }),
  nextAvailableAt: z.iso.datetime({ offset: true }),
});

export type PointResetStatus = z.infer<typeof pointResetStatusSchema>;
export type PointResetResult = z.infer<typeof pointResetResultSchema>;
