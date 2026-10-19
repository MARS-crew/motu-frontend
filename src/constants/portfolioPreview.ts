import type { Holding, HoldingSort, PortfolioSummary } from '@/types/portfolio';

// '전체'는 기본 정렬인 평가금액 많은순입니다.
export const HOLDING_SORT_OPTIONS: { label: string; value: HoldingSort }[] = [
  { label: '전체', value: 'valuation' },
  { label: '등락률 높은순', value: 'rateDesc' },
  { label: '등락률 낮은순', value: 'rateAsc' },
  { label: '거래량 많은순', value: 'volume' },
  { label: '최근 상장순', value: 'listedAt' },
];

// 자산 구성 차트 색상입니다. 예수금 다음으로 평가금액이 큰 종목 순서대로 쓰고, 마지막 색은 '기타'에 씁니다.
export const ASSET_COMPOSITION_COLORS = [
  '#2E3138',
  '#F04452',
  '#F59E0B',
  '#0E9F6E',
  '#8B8E96',
  '#B08968',
  '#6B7280',
];

// 퍼블리싱 확인용 데이터입니다. 서버 연동 시 Query로 대체합니다
export const PORTFOLIO_SUMMARY: PortfolioSummary = {
  cash: 2_345_678,
  profit: 1_234_567,
  updatedAt: '2026-09-11 19:00',
};

export const HOLDINGS: Holding[] = [
  {
    id: 6,
    name: 'PLI',
    color: '#2E3138',
    valuation: 3_250_000,
    returnRate: 5.32,
    volume: 12_400,
    listedAt: '2026.08.28',
  },
  {
    id: 101,
    name: 'TRIP',
    color: '#C0392B',
    valuation: 2_180_000,
    returnRate: 2.1,
    volume: 8_300,
    listedAt: '2026.07.14',
  },
  {
    id: 102,
    name: 'BrainNote',
    color: '#F59E0B',
    valuation: 1_610_000,
    returnRate: 1.15,
    volume: 5_100,
    listedAt: '2026.06.30',
  },
  {
    id: 103,
    name: 'PLAY',
    color: '#B08968',
    valuation: 1_420_000,
    returnRate: -1.2,
    volume: 9_800,
    listedAt: '2026.08.02',
  },
  {
    id: 7,
    name: 'CloudWorks',
    color: '#0E9F6E',
    valuation: 1_240_000,
    returnRate: 3.84,
    volume: 4_200,
    listedAt: '2026.05.21',
  },
  {
    id: 104,
    name: 'FitLife',
    color: '#F97316',
    valuation: 980_000,
    returnRate: 1.23,
    volume: 3_600,
    listedAt: '2026.08.15',
  },
  {
    id: 105,
    name: 'GreenCart',
    color: '#2563EB',
    valuation: 760_000,
    returnRate: -0.85,
    volume: 2_900,
    listedAt: '2026.04.09',
  },
  {
    id: 106,
    name: 'Nexpress',
    color: '#6366F1',
    valuation: 540_000,
    returnRate: 0.64,
    volume: 1_800,
    listedAt: '2026.07.27',
  },
  {
    id: 107,
    name: '마스외전',
    color: '#B45309',
    valuation: 420_000,
    returnRate: 3.42,
    volume: 6_700,
    listedAt: '2026.08.20',
  },
  {
    id: 108,
    name: 'NEXUS',
    color: '#6B7280',
    valuation: 300_000,
    returnRate: -2.4,
    volume: 1_200,
    listedAt: '2026.03.18',
  },
];
