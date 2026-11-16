import { z } from 'zod';

import { newDeviceSchema } from '@/schemas/newDeviceSchema';

export const secondFactorPhoneSchema = z
  .string()
  .regex(/^010-\d{4}-\d{4}$/, '올바른 휴대폰 번호를 입력해 주세요.');
export const secondFactorSchema = newDeviceSchema.extend({ phone: secondFactorPhoneSchema });

export type SecondFactorForm = z.infer<typeof secondFactorSchema>;
