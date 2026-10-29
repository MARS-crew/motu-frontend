import type {
  OpenOrderItem,
  FilledOrderItem,
  TradeHistoryItem,
  TradeHistoryParams,
} from '@/schemas/tradeHistorySchema';
import type { TransactionDateRange } from '@/utils/transactionDate';

export function getInitialTradeHistoryRange(now = Date.now()): TransactionDateRange {
  const today = new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return { start: `${today.slice(0, 7)}-01`, end: today };
}
export function toTradeHistoryParams(
  range: TransactionDateRange,
  page: number,
  size: number,
  sort: string,
): TradeHistoryParams {
  return {
    from: range.start,
    to: range.end,
    page,
    size,
    sort: sort === 'amount' ? 'AMOUNT' : 'LATEST',
  };
}
export function toTradeHistoryRow(item: TradeHistoryItem) {
  // 체결 시각은 기기의 시간대와 무관하게 한국 시간으로 표시합니다.
  const kst = new Date(Date.parse(item.tradedAt) + 9 * 60 * 60 * 1000).toISOString();
  return {
    id: String(item.tradeId),
    tradedAt: kst.slice(0, 16),
    productName: item.stockName,
    side: item.side === 'BUY' ? ('buy' as const) : ('sell' as const),
    amount: item.amount,
  };
}

export function toFilledOrderRow(item: FilledOrderItem) {
  const kst = new Date(Date.parse(item.filledAt) + 9 * 60 * 60 * 1000).toISOString();
  return {
    id: String(item.orderId),
    tradedAt: kst.slice(0, 16),
    productName: item.stockName,
    side: item.side === 'BUY' ? ('buy' as const) : ('sell' as const),
    orderPrice: item.orderPrice,
    filledQuantity: item.filledQty,
    amount: item.filledAmount,
  };
}

export function toOpenOrderRow(item: OpenOrderItem) {
  const kst = new Date(Date.parse(item.orderedAt) + 9 * 60 * 60 * 1000).toISOString();
  return {
    id: item.orderId,
    productName: item.stockName,
    orderedAt: kst.slice(0, 16),
    side: item.side === 'BUY' ? ('buy' as const) : ('sell' as const),
    orderPrice: item.price,
    quantity: item.qty,
    remainingQuantity: item.remainingQty,
    orderAmount: item.orderAmount,
    badgeClassName: 'bg-motu-black',
  };
}
export type OpenOrderRow = ReturnType<typeof toOpenOrderRow>;
