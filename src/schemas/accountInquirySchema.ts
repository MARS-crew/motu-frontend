import { z } from 'zod';

export const accountInquirySchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, '회신 이메일을 입력해 주세요.')
    .email('올바른 이메일 주소를 입력해 주세요.'),
  content: z.string().trim().min(1, '문의 내용을 입력해 주세요.'),
});

export type AccountInquiryForm = z.infer<typeof accountInquirySchema>;
