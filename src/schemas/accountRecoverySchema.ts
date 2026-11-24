import { z } from 'zod';

import { newDeviceSchema } from '@/schemas/newDeviceSchema';
import { getPasswordRules } from '@/schemas/signupInfoSchema';

const recoveryEmailSchema = z.email('올바른 이메일을 입력해 주세요.');

export const findIdSchema = newDeviceSchema.extend({
  email: z.string().trim().pipe(recoveryEmailSchema),
});
export const requestPasswordResetSchema = z.object({
  loginId: z.string().trim().min(1, '아이디를 입력해 주세요.'),
  email: recoveryEmailSchema,
});
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .refine(
        (value) => getPasswordRules(value).every(({ isMet }) => isMet),
        '8~20자의 영문·숫자·특수문자를 입력해 주세요.',
      ),
    confirmPassword: z.string(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.',
  });

export type FindIdForm = z.infer<typeof findIdSchema>;
export type RequestPasswordResetForm = z.infer<typeof requestPasswordResetSchema>;
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;
