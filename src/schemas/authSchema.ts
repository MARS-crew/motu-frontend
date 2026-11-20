import { z } from 'zod';

// 로그인 명세는 필수 문자열만 요구합니다. 가입 시 비밀번호 조합 규칙은 적용하지 않습니다.
export const loginSchema = z.object({
  loginId: z.string().trim().min(1, '아이디를 입력해 주세요.'),
  password: z.string().min(1, '비밀번호를 입력해 주세요.'),
});

export const sessionTokensSchema = z.object({
  accessToken: z.string().min(1),
  accessTokenExpiresIn: z.number().int().positive(),
  refreshToken: z.string().min(1),
});
export const loginUserSchema = z.object({
  userId: z.number().int().positive(),
  loginId: z.string(),
  nickname: z.string(),
  role: z.enum(['USER', 'ADMIN']),
});
export const loginResponseSchema = sessionTokensSchema.extend({
  verificationRequired: z.literal(false),
  user: loginUserSchema,
});
export const loginVerificationSchema = z.object({
  verificationRequired: z.literal(true),
  loginToken: z.string().min(1),
  loginTokenExpiresIn: z.number().int().positive(),
  method: z.enum(['EMAIL', 'SMS']),
  maskedTarget: z.string(),
});
export const loginResultSchema = z.discriminatedUnion('verificationRequired', [
  loginResponseSchema,
  loginVerificationSchema,
]);
export const loginFailureSchema = z.object({
  error: z.object({
    code: z.literal('AUTH_INVALID_CREDENTIALS'),
    details: z.object({ failCount: z.number().int().min(1).max(4).optional() }).optional(),
  }),
});

export type LoginForm = z.infer<typeof loginSchema>;
export type SessionTokens = z.infer<typeof sessionTokensSchema>;
