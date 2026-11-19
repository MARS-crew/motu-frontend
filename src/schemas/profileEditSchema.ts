import { z } from 'zod';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,20}$/;
const BIRTH_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 회원정보 수정 전 이메일 인증
export const profileEditVerifySchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.'),
});

export type ProfileEditVerifyForm = z.infer<typeof profileEditVerifySchema>;

// 회원정보 수정
export const profileEditSchema = z
  .object({
    password: z
      .string()
      .min(1, '비밀번호를 입력해 주세요.')
      .regex(PASSWORD_PATTERN, '8~20자, 영문·숫자·특수문자를 각 1개 이상 포함해 주세요.'),
    passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해 주세요.'),
    birthDate: z
      .string()
      .min(1, '생년월일을 입력해 주세요.')
      .regex(BIRTH_DATE_PATTERN, 'YYYY-MM-DD 형식으로 입력해 주세요.'),
  })
  .refine((form) => form.password === form.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type ProfileEditForm = z.infer<typeof profileEditSchema>;

const PHONE_NUMBER_PATTERN = /^010-\d{4}-\d{4}$/;

// 연락처 변경 전 휴대폰 점유 인증
export const phoneChangeSchema = z.object({
  phoneNumber: z.string().regex(PHONE_NUMBER_PATTERN, '전화번호 형식이 올바르지 않습니다.'),
  code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.'),
});

export type PhoneChangeForm = z.infer<typeof phoneChangeSchema>;
