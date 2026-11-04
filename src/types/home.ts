export type AssetSummary = {
  totalAsset: number;
  totalReturnRate: number;
  profitLoss: number;
  purchaseAmount: number;
  // 이번 달 거래 대금입니다. 거래 요약을 아직 받지 못했거나 실패하면 null입니다.
  tradeAmount: number | null;
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
