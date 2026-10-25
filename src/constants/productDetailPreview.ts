import type {
  ChartPeriod,
  OrderBook,
  ProductCandle,
  RecentTrade,
  TradeSummary,
} from '@/types/product';

export const CHART_PERIOD_OPTIONS: { label: string; value: ChartPeriod }[] = [
  { label: '분', value: 'minute' },
  { label: '시간', value: 'hour' },
  { label: '1일', value: 'day' },
  { label: '1주', value: 'week' },
  { label: '1개월', value: 'month' },
];

// 호가·체결·차트 API가 나오기 전까지 쓰는 확인용 데이터입니다. 서버 현재가를 기준으로 만듭니다
const CANDLE_COUNT = 40;

const PERIOD_STARTS: Record<ChartPeriod, Date> = {
  minute: new Date(2026, 7, 7, 9, 0),
  hour: new Date(2026, 7, 5, 9, 0),
  day: new Date(2026, 6, 3),
  week: new Date(2025, 10, 7),
  month: new Date(2023, 4, 1),
};

const getTimestamp = (period: ChartPeriod, index: number) => {
  const date = new Date(PERIOD_STARTS[period]);
  if (period === 'minute') date.setMinutes(date.getMinutes() + index);
  if (period === 'hour') date.setHours(date.getHours() + index);
  if (period === 'day') date.setDate(date.getDate() + index);
  if (period === 'week') date.setDate(date.getDate() + index * 7);
  if (period === 'month') date.setMonth(date.getMonth() + index);
  return date.getTime();
};

const PERIOD_SEEDS: Record<ChartPeriod, number> = { minute: 1, hour: 2, day: 3, week: 4, month: 5 };

const createRandom = (initialSeed: number) => {
  let seed = initialSeed;
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

// 상품·기간마다 같은 모양이 나오도록 고정 시드로 만들고, 마지막 종가를 현재가에 맞춥니다.
export const getProductCandles = (
  product: { id: number; price: number },
  period: ChartPeriod,
): ProductCandle[] => {
  const random = createRandom(product.id * 97 + PERIOD_SEEDS[period] * 13);

  const candles: ProductCandle[] = [];
  let close = product.price;
  for (let index = CANDLE_COUNT - 1; index >= 0; index--) {
    const open = close * (1 + (random() - 0.5) * 0.05);
    candles.unshift({
      timestamp: getTimestamp(period, index),
      open: Math.round(open),
      high: Math.round(Math.max(open, close) * (1 + random() * 0.012)),
      low: Math.round(Math.min(open, close) * (1 - random() * 0.012)),
      close: Math.round(close),
      volume: Math.round(200_000 * (0.4 + random() * 0.8)),
    });
    close = open * (1 + (random() - 0.5) * 0.01);
  }
  return candles;
};

// 거래 요약(시가·고가·저가·종가)은 1일 차트의 마지막 봉으로 만듭니다.
export const getTradeSummary = (product: { id: number; price: number }): TradeSummary => {
  const latest = getProductCandles(product, 'day').at(-1);
  if (!latest) {
    const { price } = product;
    return { open: price, high: price, low: price, close: price, volume: 0, tradeAmount: 0 };
  }
  return {
    open: latest.open,
    high: latest.high,
    low: latest.low,
    close: latest.close,
    volume: latest.volume,
    tradeAmount: latest.volume * latest.close,
  };
};

const ORDER_BOOK_DEPTH = 5;
const RECENT_TRADE_COUNT = 5;

// 가격대별 호가 단위입니다. 실제 단위는 상장 심사에서 확정된 값을 서버에서 받습니다.
export const getTickSize = (price: number) => {
  if (price < 1_000) return 1;
  if (price < 5_000) return 5;
  if (price < 50_000) return 50;
  return 100;
};

const getBasePrice = (price: number) => {
  const tickSize = getTickSize(price);
  return { tickSize, basePrice: Math.round(price / tickSize) * tickSize };
};

export const getOrderBook = (product: { id: number; price: number }): OrderBook => {
  const random = createRandom(product.id * 131);
  const { tickSize, basePrice } = getBasePrice(product.price);
  const createQuantity = () => Math.round(1_000 + random() * 24_000);

  return {
    asks: Array.from({ length: ORDER_BOOK_DEPTH }, (_, index) => ({
      price: basePrice + tickSize * (index + 1),
      quantity: createQuantity(),
    })),
    bids: Array.from({ length: ORDER_BOOK_DEPTH }, (_, index) => ({
      price: basePrice - tickSize * (index + 1),
      quantity: createQuantity(),
    })),
  };
};

const LAST_TRADE_TIME = new Date(2026, 7, 7, 15, 29, 27);

// 매도 체결은 매수 1호가, 매수 체결은 현재가에 체결된 것으로 만듭니다.
export const getRecentTrades = (product: { id: number; price: number }): RecentTrade[] => {
  const random = createRandom(product.id * 173);
  const { tickSize, basePrice } = getBasePrice(product.price);
  const time = new Date(LAST_TRADE_TIME);

  return Array.from({ length: RECENT_TRADE_COUNT }, (_, index) => {
    if (index > 0) time.setSeconds(time.getSeconds() - Math.round(20 + random() * 20));
    const side = random() < 0.5 ? 'sell' : 'buy';

    return {
      id: index,
      time: time.toTimeString().slice(0, 8),
      price: side === 'sell' ? basePrice - tickSize : basePrice,
      quantity: Math.round(10 + random() * 490),
      side,
    };
  });
};
