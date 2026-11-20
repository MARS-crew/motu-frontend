import { z } from 'zod';

export const signupAvailabilitySchema = z.object({ available: z.boolean() });
