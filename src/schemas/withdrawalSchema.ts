import { z } from 'zod';

export const WITHDRAWAL_REASON_MAX_LENGTH = 50;

export const withdrawalSchema = z.object({
  reason: z
    .string()
    .max(WITHDRAWAL_REASON_MAX_LENGTH, '탈퇴 사유는 50자 이내로 입력해 주세요.')
    .trim()
    .min(1, '탈퇴 사유를 입력해 주세요.'),
});

export type WithdrawalForm = z.infer<typeof withdrawalSchema>;
