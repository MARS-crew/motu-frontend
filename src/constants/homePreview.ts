import type { AssetSummary, Notice, StockSummary } from '@/types/home';

// 퍼블리싱 확인용 데이터입니다. 서버 연동 시 Query로 대체합니다
export const ASSET_SUMMARY: AssetSummary = {
  totalAsset: 42860500,
  totalReturnRate: 5.24,
  profitLoss: 1234567,
  purchaseAmount: 40722300,
  tradeAmount: 1204000,
};

export const LATEST_NOTICE: Notice = {
  id: 1,
  title: '[점검] 9월 17일 새벽 시스템 점검 안내',
  createdAt: '2026.09.12',
};

// 최근 본 종목이 없는 화면은 빈 배열로 바꿔서 확인합니다.
export const RECENT_STOCKS: StockSummary[] = [
  { id: 1, name: '토스', price: 15300, changeRate: 1.86, color: '#2C6FE0' },
  { id: 2, name: '모투', price: 8420, changeRate: -0.73, color: '#2E3138' },
  { id: 3, name: '마스외전', price: 2580, changeRate: 3.42, color: '#B4551F' },
];

export const NEW_LISTINGS: StockSummary[] = [
  {
    id: 4,
    name: 'PLI',
    price: 1200,
    changeRate: 2.11,
    color: '#2E3138',
    description: 'AI 기반 여행 플랫폼 APP',
    listedAt: '2026. 08. 28.',
  },
  {
    id: 5,
    name: 'CloudWorks',
    price: 4350,
    changeRate: -0.11,
    color: '#0E9F6E',
    description: '클라우드 기반 협업 솔루션',
    listedAt: '2026. 08. 27.',
  },
  {
    id: 3,
    name: '마스외전',
    price: 2580,
    changeRate: 3.42,
    color: '#B4551F',
    description: 'AI 여행 일정 추천 서비스',
    listedAt: '2026. 08. 26.',
  },
];
