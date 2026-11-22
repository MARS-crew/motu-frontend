import { z } from 'zod';

export const myInfoSchema = z.object({
  userId: z.number().int().positive(),
  loginId: z.string(),
  nickname: z.string(),
  email: z.string(),
  // 연락처는 하이픈 없이 내려오고, 등록하지 않았으면 null입니다.
  phoneNumber: z.string().nullable(),
  // 생년월일(YYYY-MM-DD)이며, 관리자 계정은 null입니다.
  birthDate: z.string().nullable(),
  userStatus: z.enum(['ACTIVE', 'LOCKED', 'BLOCKED']),
  twoFactorStatus: z.enum(['NOT_SET', 'ENABLED', 'DISABLED']),
});

export type MyInfo = z.infer<typeof myInfoSchema>;
