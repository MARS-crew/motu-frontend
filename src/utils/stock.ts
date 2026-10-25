import type { NewListing } from '@/types/newListing';
import type { Product, ProductDetail, TradeStatus } from '@/types/product';
import type {
  NewListingItem,
  StockDetail,
  StockMetrics,
  StockItem,
  StockTradeStatus,
} from '@/types/stock';
import { formatDotDate } from '@/utils/formatDate';

// 상품 API 응답을 공용 상품 목록 아이템 형태로 바꿉니다.
export const toProduct = (stock: StockItem): Product => ({
  id: stock.stockId,
  name: stock.name,
  category: stock.sectorName,
  price: stock.currentPrice,
  changeRate: stock.changeRate,
  logoImageUrl: stock.logoImageUrl,
  isFavorite: stock.isWishlisted,
});

export const toNewListing = (stock: NewListingItem): NewListing => ({
  id: stock.stockId,
  name: stock.name,
  description: stock.summary,
  listedAt: formatDotDate(stock.listingDate),
  price: stock.currentPrice,
  changeRate: stock.changeRate,
  logoImageUrl: stock.logoImageUrl,
  isNew: stock.isNew,
  isFavorite: stock.isWishlisted,
});

const TRADE_STATUSES: Record<StockTradeStatus, TradeStatus> = {
  PENDING: 'waiting',
  ACTIVE: 'tradable',
  PAUSED: 'suspended',
  CLOSED: 'ended',
};

const formatCount = (value: number, unit: string) => `${value.toLocaleString('ko-KR')}${unit}`;

// 상장 신청 때 입력한 지표 중 값이 있는 것만 한 줄씩 보여줍니다.
const toMetricLines = (metrics: StockMetrics) => {
  const lines = [
    metrics.mau !== null && `월간 활성 사용자(MAU): ${formatCount(metrics.mau, '명')}`,
    metrics.dau !== null && `일간 활성 사용자(DAU): ${formatCount(metrics.dau, '명')}`,
    metrics.revenue !== null && `연간 매출: ${formatCount(metrics.revenue, '원')}`,
    metrics.transactionVolume !== null &&
      `거래액(최근 12개월): ${formatCount(metrics.transactionVolume, '원')}`,
  ].filter((line): line is string => Boolean(line));

  if (lines.length > 0 && metrics.startDate && metrics.endDate) {
    lines.push(
      `집계 기간: ${metrics.startDate.replaceAll('-', '.')} ~ ${metrics.endDate.replaceAll('-', '.')}`,
    );
  }
  return lines;
};

export const toProductDetail = (stock: StockDetail): ProductDetail => ({
  id: stock.stockId,
  name: stock.name,
  category: stock.sectorName,
  price: stock.currentPrice,
  changeRate: stock.changeRate,
  logoImageUrl: stock.logoImageUrl,
  isFavorite: stock.isWishlisted,
  description: stock.summary,
  tradeStatus: TRADE_STATUSES[stock.tradeStatus],
  info: {
    introduction: stock.description ?? undefined,
    operator: stock.operatorName,
    officialUrl: stock.officialUrl ?? undefined,
    metrics: toMetricLines(stock.metrics),
    // 피그마 표기인 '2026. 01. 05' 형식으로 보여줍니다.
    listedAt: formatDotDate(stock.listingDate).split('.').join('. '),
  },
});
