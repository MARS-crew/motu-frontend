import type { AssetSummary } from '@/types/home';

// 퍼블리싱 확인용 데이터입니다. 포트폴리오(총 자산) API가 나오면 Query로 대체합니다
export const ASSET_SUMMARY: AssetSummary = {
  totalAsset: 42860500,
  totalReturnRate: 5.24,
  profitLoss: 1234567,
  purchaseAmount: 40722300,
  tradeAmount: 1204000,
};
