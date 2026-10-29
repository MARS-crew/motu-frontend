import { z } from 'zod';

export const tradeHistoryPeriodSchema = z
  .object({
    from: z.iso.date({ error: '조회 시작일을 확인해 주세요.' }),
    to: z.iso.date({ error: '조회 종료일을 확인해 주세요.' }),
  })
  .refine((value) => value.from <= value.to, '조회 시작일은 종료일보다 늦을 수 없습니다.');
export const tradeHistoryParamsSchema = tradeHistoryPeriodSchema.safeExtend({
  page: z.number().int().positive(),
  size: z.number().int().min(1).max(50),
  sort: z.enum(['LATEST', 'AMOUNT', 'STOCK_NAME']),
});
export const tradeHistoryItemSchema = z.object({
  tradeId: z.number().int().positive(),
  tradedAt: z.iso.datetime({ offset: true }),
  orderId: z.number().int().positive(),
  stockId: z.number().int().positive(),
  stockName: z.string(),
  side: z.enum(['BUY', 'SELL']),
  price: z.number().nonnegative(),
  qty: z.number().int().positive(),
  amount: z.number().nonnegative(),
  fee: z.number().nonnegative(),
});
export const tradeHistoryListSchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  page: z.number().int().positive(),
  size: z.number().int().min(1).max(50),
  totalCount: z.number().int().nonnegative(),
  items: z.array(tradeHistoryItemSchema),
});
export const tradeHistorySummarySchema = z.object({
  from: z.iso.date(),
  to: z.iso.date(),
  totalAmount: z.number().nonnegative(),
  buyAmount: z.number().nonnegative(),
  sellAmount: z.number().nonnegative(),
});
export type TradeHistoryPeriod = z.infer<typeof tradeHistoryPeriodSchema>;
export type TradeHistoryParams = z.infer<typeof tradeHistoryParamsSchema>;
export type TradeHistoryItem = z.infer<typeof tradeHistoryItemSchema>;
