import { z } from 'zod';

import { signupConsentSchema } from '@/schemas/signupConsentSchema';
import {
  signupIdSchema,
  signupNicknameSchema,
  signupPasswordSchema,
} from '@/schemas/signupInfoSchema';

export const signupEmailRequestSchema = z.object({
  email: z.email('올바른 이메일 형식으로 입력해 주세요.'),
});
export const signupEmailConfirmSchema = signupEmailRequestSchema.extend({
  code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.'),
});
export const signupEmailConfirmedSchema = z.object({ verified: z.boolean() });
export const signupRequestSchema = signupConsentSchema.extend({
  loginId: signupIdSchema,
  password: signupPasswordSchema,
  nickname: signupNicknameSchema,
  email: z.email('올바른 이메일 형식으로 입력해 주세요.'),
  phoneNumber: z
    .string()
    .regex(/^010-?\d{4}-?\d{4}$/)
    .optional(),
  birthDate: z.iso.date(),
});
export const signupResponseSchema = z.object({
  userId: z.number().int().positive(),
  loginId: z.string(),
  nickname: z.string(),
  userStatus: z.enum(['ACTIVE', 'LOCKED', 'BLOCKED', 'WITHDRAWN']),
  role: z.enum(['USER', 'ADMIN']),
  cash: z.number().nonnegative(),
});
export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type SignupEmailConfirmation = z.infer<typeof signupEmailConfirmSchema>;
export type SignupResponse = z.infer<typeof signupResponseSchema>;
