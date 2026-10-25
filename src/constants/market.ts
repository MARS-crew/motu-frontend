import type { MarketSort } from '@/types/product';

// '전체'는 기본 정렬인 거래대금 많은순입니다. (화면설계서 USR-MARKET-01)
export const MARKET_SORT_OPTIONS: { label: string; value: MarketSort }[] = [
  { label: '전체', value: 'TRADE_AMOUNT' },
  { label: '등락률 높은순', value: 'CHANGE_RATE_DESC' },
  { label: '등락률 낮은순', value: 'CHANGE_RATE_ASC' },
  { label: '거래량 많은순', value: 'VOLUME' },
  { label: '최근 상장순', value: 'LISTING_DATE' },
];
