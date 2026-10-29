// 시세(호가·체결·차트) API 응답 타입입니다. (스웨거 Orders·Trades·Charts 기준)
export type OrderBookLevelItem = {
  price: number;
  qty: number;
};

// 매도는 낮은 가격부터, 매수는 높은 가격부터 최대 5개이고 주문이 없는 가격은 빠집니다.
export type OrderBookItem = {
  stockId: number;
  asks: OrderBookLevelItem[];
  bids: OrderBookLevelItem[];
};

export type RecentTradeItem = {
  tradeId: number;
  price: number;
  qty: number;
  side: 'BUY' | 'SELL';
  createDate: string;
};

// 오늘(한국 시간 00시 기준) 체결이 없으면 시가·고가·저가는 null입니다.
export type DailySummaryItem = {
  stockId: number;
  currentPrice: number;
  prevClosePrice: number;
  changeAmount: number;
  changeRate: number;
  openPrice: number | null;
  highPrice: number | null;
  lowPrice: number | null;
  volume: number;
  tradeAmount: number;
};

export type CandleInterval = 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';

export type CandleItem = {
  time: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
  tradeAmount: number;
};

// 봉은 오래된 순이고, 체결이 없던 구간의 봉은 없습니다.
export type CandlePage = {
  stockId: number;
  interval: CandleInterval;
  items: CandleItem[];
  nextCursor: string | null;
};
