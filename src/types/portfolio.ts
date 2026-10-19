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
