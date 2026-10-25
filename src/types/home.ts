export type AssetSummary = {
  totalAsset: number;
  totalReturnRate: number;
  profitLoss: number;
  purchaseAmount: number;
  tradeAmount: number;
};

export type Notice = {
  id: number;
  title: string;
  createdAt: string;
};

export type StockSummary = {
  id: number;
  name: string;
  price: number;
  changeRate: number;
  // 로고가 없으면 color 배경에 이름 첫 글자를 표시합니다.
  logoImageUrl?: string | null;
  color?: string;
  description?: string;
  listedAt?: string;
};
