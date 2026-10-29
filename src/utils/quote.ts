import type {
  ChartPeriod,
  OrderBook,
  ProductCandle,
  RecentTrade,
  TradeSummary,
} from '@/types/product';
import type {
  CandleInterval,
  CandleItem,
  DailySummaryItem,
  OrderBookItem,
  RecentTradeItem,
} from '@/types/quote';

export const CANDLE_INTERVALS: Record<ChartPeriod, CandleInterval> = {
  minute: 'MINUTE',
  hour: 'HOUR',
  day: 'DAY',
  week: 'WEEK',
  month: 'MONTH',
};

// 시세 API 응답을 화면에서 쓰는 형태로 바꿉니다.
export const toOrderBook = (orderBook: OrderBookItem): OrderBook => ({
  asks: orderBook.asks.map((level) => ({ price: level.price, quantity: level.qty })),
  bids: orderBook.bids.map((level) => ({ price: level.price, quantity: level.qty })),
});

const formatTradeTime = (value: string) => new Date(value).toTimeString().slice(0, 8);

export const toRecentTrade = (trade: RecentTradeItem): RecentTrade => ({
  id: trade.tradeId,
  time: formatTradeTime(trade.createDate),
  price: trade.price,
  quantity: trade.qty,
  side: trade.side === 'SELL' ? 'sell' : 'buy',
});

// 화면설계서 기준 종가는 전일 마지막 체결가입니다.
export const toTradeSummary = (summary: DailySummaryItem): TradeSummary => ({
  open: summary.openPrice,
  high: summary.highPrice,
  low: summary.lowPrice,
  close: summary.prevClosePrice,
  volume: summary.volume,
  tradeAmount: summary.tradeAmount,
  currentPrice: summary.currentPrice,
  changeAmount: summary.changeAmount,
  changeRate: summary.changeRate,
});

export const toProductCandle = (candle: CandleItem): ProductCandle => ({
  timestamp: new Date(candle.time).getTime(),
  open: candle.openPrice,
  high: candle.highPrice,
  low: candle.lowPrice,
  close: candle.closePrice,
  volume: candle.volume,
});
