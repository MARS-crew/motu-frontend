import { z } from 'zod';

export const inquiryTypeSchema = z.enum(['LOGIN_FAILED_LOCKED', 'SUSPENDED', 'PHONE_UNAVAILABLE']);
export const accountInquirySchema = z.object({
  inquiryType: inquiryTypeSchema,
  replyEmail: z.email('올바른 이메일 형식으로 입력해 주세요.').max(255),
  content: z.string().trim().min(1, '필수 입력 항목입니다.').max(5000),
});
export const accountInquiryResponseSchema = z.object({
  inquiryCode: z.string(),
  status: z.literal('SUBMITTED'),
  createDate: z.iso.datetime(),
  message: z.string(),
});
export type AccountInquiryForm = z.infer<typeof accountInquirySchema>;
