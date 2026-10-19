import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';

// 서버 연결 전, Figma 화면 재현용 기준일과 운영 기간입니다.
export const LISTING_METRICS_REFERENCE_DATE = '2026-09-01';
export const LISTING_METRICS_LAUNCH_DATE = '2026-03-01';
export const LISTING_METRICS_DEFAULT_PERIOD = { start: '2025-12-01', end: '2025-12-31' };
export const LISTING_TRANSACTION_PERIODS = {
  lastTwelveMonths: { start: '2025-09-01', end: '2026-08-31' },
  entireOperation: { start: LISTING_METRICS_LAUNCH_DATE, end: LISTING_METRICS_REFERENCE_DATE },
};
export const LISTING_TRANSACTION_BASES = [
  {
    value: 'lastTwelveMonths',
    label: '최근 완료 12개월',
    description: '기본값 · 최근 완료된 12개월 기준',
  },
  {
    value: 'entireOperation',
    label: '운영기간 전체',
    description: '운영 12개월 미만인 경우 선택할 수 있습니다.',
  },
] as const;

export const EMPTY_LISTING_METRICS: ListingMetricsForm = {
  mau: '',
  dau: '',
  annualRevenue: '',
  revenuePeriod: { start: '', end: '' },
  revenueSource: '',
  revenueExtractedAt: '',
  transactionAmount: '',
  transactionBasis: 'lastTwelveMonths',
  transactionSource: '',
  transactionExtractedAt: '',
};
export const LISTING_METRICS_PREVIEW: ListingMetricsForm = {
  mau: '250,000',
  dau: '42,000',
  annualRevenue: '320,000,000',
  revenuePeriod: { start: '', end: '' },
  revenueSource: '월간 손익 대시보드',
  revenueExtractedAt: '2026-09-01',
  transactionAmount: '1,240,000,000',
  transactionBasis: 'lastTwelveMonths',
  transactionSource: '결제시스템 / 결제 완료 내역',
  transactionExtractedAt: '2026-09-01',
};
