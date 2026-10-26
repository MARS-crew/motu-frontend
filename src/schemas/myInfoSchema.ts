import { z } from 'zod';

export const myInfoSchema = z.object({
  userId: z.number().int().positive(),
  userStatus: z.enum(['ACTIVE', 'LOCKED', 'BLOCKED']),
});

export type MyInfo = z.infer<typeof myInfoSchema>;
