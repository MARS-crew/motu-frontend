import { z } from 'zod';

import { findIdSchema } from '@/schemas/accountRecoverySchema';
import { verificationDeliverySchema } from '@/schemas/loginVerificationSchema';

export const sendFindIdCodeSchema = findIdSchema.pick({ email: true });
export const findIdDeliverySchema = verificationDeliverySchema;
export const findIdResultSchema = z.object({ maskedLoginId: z.string().min(1) });

export type SendFindIdCodeRequest = z.infer<typeof sendFindIdCodeSchema>;
