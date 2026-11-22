import { z } from 'zod';
import { twoFactorStatusSchema } from '@/schemas/twoFactorSchema';

export const myInfoSchema = z.object({
  userId: z.number().int().positive(),
  userStatus: z.enum(['ACTIVE', 'LOCKED', 'BLOCKED']),
  nickname: z.string(),
  email: z.string(),
  phoneNumber: z.string().nullable().optional(),
  twoFactorStatus: twoFactorStatusSchema,
});

export type MyInfo = z.infer<typeof myInfoSchema>;
