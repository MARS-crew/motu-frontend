import { z } from 'zod';

// 화면설계서 기준 0P 이하는 입력할 수 없습니다. (USR-MARKET-02-M01)
export const priceAlertSchema = z.object({
  price: z
    .string()
    .trim()
    .min(1, '설정 가격을 입력해 주세요.')
    .refine((value) => {
      const price = Number(value.replaceAll(',', ''));
      return Number.isSafeInteger(price) && price > 0;
    }, '0P보다 큰 가격을 입력해 주세요.'),
});

export type PriceAlertForm = z.infer<typeof priceAlertSchema>;
