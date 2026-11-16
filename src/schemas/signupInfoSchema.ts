import { z } from 'zod';

export const signupIdSchema = z
  .string()
  .min(1, '아이디를 입력해 주세요.')
  .regex(/^[a-z0-9]{5,20}$/, '영문 소문자·숫자 5~20자를 입력해 주세요.');
export const signupNicknameSchema = z
  .string()
  .min(1, '닉네임을 입력해 주세요.')
  .regex(/^[가-힣a-zA-Z0-9]{2,10}$/, '한글·영문·숫자 2~10자를 입력해 주세요.');

export const getPasswordRules = (password: string) => [
  { label: '8~20자', isMet: password.length >= 8 && password.length <= 20 },
  { label: '영문 1자 이상', isMet: /[a-z]/i.test(password) },
  { label: '숫자 1자 이상', isMet: /[0-9]/.test(password) },
  { label: '특수문자 1개 이상', isMet: /[^\p{L}\p{N}\s]/u.test(password) },
];

export const signupInfoSchema = z
  .object({
    loginId: signupIdSchema,
    password: z
      .string()
      .min(1, '비밀번호를 입력해 주세요.')
      .refine(
        (password) => getPasswordRules(password).every(({ isMet }) => isMet),
        '영문·숫자·특수문자를 포함해 주세요.',
      ),
    confirmPassword: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
    nickname: signupNicknameSchema,
    email: z
      .string()
      .min(1, '이메일을 입력해 주세요.')
      .pipe(z.email('올바른 이메일을 입력해 주세요.')),
    phone: z.string().regex(/^(?:010-?\d{4}-?\d{4})?$/, '올바른 휴대폰 번호를 입력해 주세요.'),
    birthDate: z
      .string()
      .min(1, '생년월일을 입력해 주세요.')
      .pipe(
        z.iso
          .date('생년월일을 YYYY-MM-DD 형식으로 입력해 주세요.')
          .refine((date) => new Date(date) <= new Date(), '미래 날짜는 입력할 수 없습니다.'),
      ),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.',
  });

export type SignupInfoForm = z.infer<typeof signupInfoSchema>;
