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
