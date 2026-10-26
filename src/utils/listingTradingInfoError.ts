import { isAxiosError } from 'axios';
import { z, ZodError } from 'zod';

import type { ListingTradingInfoForm } from '@/schemas/listingTradingInfoSchema';

const TRADING_API_FIELDS: Record<string, keyof ListingTradingInfoForm> = {
  desiredPrice: 'listingPrice',
  totalIssuedQuantity: 'totalQuantity',
  minOrderQuantity: 'minimumOrderQuantity',
  tickSize: 'tickSize',
  desiredListingDate: 'tradingStartAt',
  priceCalculationBasis: 'priceReason',
};
const errorSchema = z.object({
  error: z.object({
    message: z.string(),
    details: z
      .object({
        fieldErrors: z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional(),
      })
      .nullish(),
  }),
});

export const getListingTradingInfoField = (name: string) =>
  TRADING_API_FIELDS[name.replace(/^data\./, '')];

export function getListingTradingInfoError(error: unknown) {
  const result: { message: string; fields: Partial<Record<keyof ListingTradingInfoForm, string>> } =
    {
      message: '신청서를 저장하지 못했습니다. 입력 내용은 유지됩니다. 다시 시도해 주세요.',
      fields: {},
    };
  if (error instanceof ZodError) {
    for (const issue of error.issues) {
      const name = String(issue.path.at(-1));
      const field =
        getListingTradingInfoField(name) ??
        Object.values(TRADING_API_FIELDS).find((value) => value === name);
      if (field && !result.fields[field]) result.fields[field] = issue.message;
    }
    result.message = error.issues[0]?.message ?? result.message;
    return result;
  }
  if (!isAxiosError(error)) return result;
  // 필드 상세 형식이 달라도 서버의 안내 메시지는 표시합니다.
  const body = error.response?.data;
  const message = z.object({ error: z.object({ message: z.string() }) }).safeParse(body);
  if (message.success && message.data.error.message.trim())
    result.message = message.data.error.message;
  const parsed = errorSchema.safeParse(body);
  if (parsed.success)
    for (const [name, messages] of Object.entries(parsed.data.error.details?.fieldErrors ?? {})) {
      const field = getListingTradingInfoField(name);
      const text = Array.isArray(messages) ? messages[0] : messages;
      if (field && text) result.fields[field] = text;
    }
  return result;
}
