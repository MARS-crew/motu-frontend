import type { z } from 'zod';

import type { loginResponseSchema, loginUserSchema } from '@/schemas/authSchema';

export type LoginUser = z.infer<typeof loginUserSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
