export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  changeRate: number;
  // 로고가 없으면 color 배경에 이름 첫 글자를 표시합니다.
  logoImageUrl?: string | null;
  color?: string;
  isFavorite: boolean;
};

export type MarketProduct = Product & {
  tradeAmount: number;
  volume: number;
  listedAt: string;
};

// 마켓 정렬 값은 서버 sort 파라미터를 그대로 사용합니다.
export type MarketSort =
  'TRADE_AMOUNT' | 'CHANGE_RATE_DESC' | 'CHANGE_RATE_ASC' | 'VOLUME' | 'LISTING_DATE';

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

export type TradeStatus = 'waiting' | 'tradable' | 'suspended' | 'ended';

// 상장 신청 시 입력한 정보라 비어 있을 수 있습니다.
export type ProductInfo = {
  introduction?: string;
  operator?: string;
  officialUrl?: string;
  metrics: string[];
  listedAt?: string;
};

export type ProductDetail = Product & {
  description: string;
  tradeStatus: TradeStatus;
  summary: TradeSummary;
  info: ProductInfo;
  tickSize: number;
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
