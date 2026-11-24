import { z } from 'zod';

import { myInfoSchema } from '@/schemas/myInfoSchema';

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s])\S{8,20}$/;
const BIRTH_DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

// 회원정보 수정 전 이메일 인증
export const profileEditVerifySchema = z.object({
  email: z.string().email('올바른 이메일을 입력해 주세요.'),
  code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.'),
});

export type ProfileEditVerifyForm = z.infer<typeof profileEditVerifySchema>;

// 회원정보 수정
export const profileEditSchema = z
  .object({
    // 비워 두면 비밀번호를 바꾸지 않습니다.
    password: z
      .string()
      .refine(
        (value) => value === '' || PASSWORD_PATTERN.test(value),
        '8~20자, 영문·숫자·특수문자를 각 1개 이상 포함해 주세요.',
      ),
    passwordConfirm: z.string(),
    birthDate: z
      .string()
      .refine(
        (value) => value === '' || BIRTH_DATE_PATTERN.test(value),
        '생년월일을 YYYY-MM-DD 형식으로 입력해 주세요.',
      ),
  })
  .refine((form) => form.password === form.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export type ProfileEditForm = z.infer<typeof profileEditSchema>;

const PHONE_NUMBER_PATTERN = /^010-\d{4}-\d{4}$/;

// 연락처 변경 전 휴대폰 점유 인증
export const phoneChangeSchema = z.object({
  phoneNumber: z.string().regex(PHONE_NUMBER_PATTERN, '올바른 휴대폰 번호를 입력해 주세요.'),
  code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.'),
});

export type PhoneChangeForm = z.infer<typeof phoneChangeSchema>;

// 연락처 변경 인증 확인 응답입니다. 번호 저장은 PATCH /users/me/phone-number로 따로 합니다.
export const phoneChangeConfirmedSchema = z.object({ verified: z.boolean() });

// 회원정보 수정 이메일 인증 확인 응답: editableUntil까지 수정을 한 번 할 수 있습니다.
export const profileEditEmailConfirmedSchema = z.object({
  verified: z.boolean(),
  editableUntil: z.iso.datetime(),
});

// 회원정보 수정 요청: 바꿀 항목만 보냅니다.
export const profileUpdateRequestSchema = z.object({
  password: z.string().regex(PASSWORD_PATTERN).optional(),
  birthDate: z.iso.date().optional(),
});

export type ProfileUpdateRequest = z.infer<typeof profileUpdateRequestSchema>;

// 비밀번호를 바꿨으면 reloginRequired가 true입니다.
export const profileUpdateResponseSchema = myInfoSchema.extend({
  reloginRequired: z.boolean(),
});
