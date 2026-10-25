// 상품 관련 API 응답 타입입니다. (스웨거 StockItemResDto 기준)
export type StockItem = {
  stockId: number;
  stockCode: string;
  name: string;
  sectorCode: number;
  sectorName: string;
  logoImageUrl: string | null;
  currentPrice: number;
  changeAmount: number;
  changeRate: number;
  volume: number;
  tradeAmount: number;
  listingDate: string;
  tradeStatus: string;
  isWishlisted: boolean;
};

export type NewListingItem = StockItem & {
  summary: string;
  isNew: boolean;
};

export type StockTradeStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CLOSED';

// 상장 신청 때 입력한 지표라 값이 없으면 null입니다.
export type StockMetrics = {
  mau: number | null;
  dau: number | null;
  revenue: number | null;
  transactionVolume: number | null;
  startDate: string | null;
  endDate: string | null;
};

export type StockDetail = {
  stockId: number;
  stockCode: string;
  name: string;
  summary: string;
  description: string | null;
  sectorCode: number;
  sectorName: string;
  logoImageUrl: string | null;
  mainImageUrl: string;
  officialUrl: string | null;
  operatorName: string;
  metrics: StockMetrics;
  listingDate: string;
  tradeStatus: StockTradeStatus;
  currentPrice: number;
  changeAmount: number;
  changeRate: number;
  isWishlisted: boolean;
};
