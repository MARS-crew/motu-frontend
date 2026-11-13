import { z } from 'zod';

export const newDeviceSchema = z.object({
  code: z.string().regex(/^\d{6}$/, '인증번호 6자리를 입력해 주세요.'),
});

export type NewDeviceForm = z.infer<typeof newDeviceSchema>;
