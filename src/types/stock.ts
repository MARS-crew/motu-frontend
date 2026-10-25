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
