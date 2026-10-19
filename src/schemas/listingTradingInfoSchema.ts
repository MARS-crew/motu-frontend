import { z } from 'zod';

export const MIN_ORDER_QUANTITIES = ['1', '5', '10', '50', '100'] as const;
export const PRICE_TICK_SIZES = ['1', '5', '10', '50', '100'] as const;

const positiveInteger = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine(
      (value) =>
        !value ||
        (/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value) &&
          Number.isSafeInteger(Number(value.replaceAll(',', ''))) &&
          Number(value.replaceAll(',', '')) > 0),
      '0보다 큰 정수를 입력해 주세요.',
    );

export const listingTradingInfoSchema = z.object({
  listingPrice: positiveInteger('희망 상장가를 입력해 주세요.'),
  totalQuantity: positiveInteger('총 발행 수량을 입력해 주세요.'),
  minimumOrderQuantity: z.enum(MIN_ORDER_QUANTITIES),
  tickSize: z.enum(PRICE_TICK_SIZES),
  tradingStartAt: z.string().refine((value) => {
    if (!/^\d{4}\.\d{2}\.\d{2} \d{2}:\d{2}$/.test(value)) return false;
    const date = new Date(`${value.slice(0, 10).replaceAll('.', '-')}T${value.slice(11)}:00+09:00`);
    if (Number.isNaN(date.getTime())) return false;
    const [year, month, day, hour, minute] = value.split(/[. :]/).map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();
    return (
      month >= 1 && month <= 12 && day >= 1 && day <= daysInMonth && hour <= 23 && minute <= 59
    );
  }, '날짜와 시간을 선택해 주세요.'),
  priceReason: z.string().trim().min(1, '가격 산정 근거를 입력해 주세요.'),
});

export type ListingTradingInfoForm = z.infer<typeof listingTradingInfoSchema>;
