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
  color: string;
  description?: string;
  listedAt?: string;
};
