export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  changeRate: number;
  color: string;
  isFavorite: boolean;
};

export type MarketProduct = Product & {
  tradeAmount: number;
  volume: number;
  listedAt: string;
};

export type MarketSort = 'tradeAmount' | 'rateDesc' | 'rateAsc' | 'volume' | 'listedAt';

export type ChartPeriod = 'minute' | 'hour' | 'day' | 'week' | 'month';

export type ProductCandle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type TradeSummary = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  tradeAmount: number;
};

export type ProductDetail = Product & {
  description: string;
  isTradable: boolean;
  summary: TradeSummary;
};

export type OrderBookLevel = {
  price: number;
  quantity: number;
};

export type OrderBook = {
  asks: OrderBookLevel[];
  bids: OrderBookLevel[];
};

export type TradeSide = 'buy' | 'sell';

export type RecentTrade = {
  id: number;
  time: string;
  price: number;
  quantity: number;
  side: TradeSide;
};
