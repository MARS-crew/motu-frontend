// 포트폴리오 API 응답 타입입니다. (스웨거 GetPortfolioResDto 기준)
export type PortfolioHoldingItem = {
  stockId: number;
  stockCode: string;
  name: string;
  logoImageUrl: string | null;
  tradeStatus: 'PENDING' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  qty: number;
  sellableQty: number;
  avgPrice: number;
  currentPrice: number;
  purchaseAmount: number;
  evaluationAmount: number;
  profitLoss: number;
  profitRate: number;
  assetRatio: number;
};

// 금액은 모두 현재가(baseTime) 기준입니다. 보유 종목은 평가금액이 큰 순서로 내려옵니다.
export type PortfolioItem = {
  totalAsset: number;
  // 예수금은 매수 주문에 예약된 포인트를 포함합니다.
  cash: number;
  lockedCash: number;
  availableCash: number;
  evaluationAmount: number;
  purchaseAmount: number;
  profitLoss: number;
  profitRate: number;
  cashRatio: number;
  holdings: PortfolioHoldingItem[];
  baseTime: string;
};

export type Holding = {
  id: number;
  name: string;
  color: string;
  valuation: number;
  returnRate: number;
  volume: number;
  listedAt: string;
};

export type HoldingSort = 'valuation' | 'rateDesc' | 'rateAsc' | 'volume' | 'listedAt';

export type PortfolioSummary = {
  cash: number;
  profit: number;
  updatedAt: string;
};

export type AssetCompositionItem = {
  label: string;
  value: number;
  color: string;
};
