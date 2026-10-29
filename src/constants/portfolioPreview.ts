import type { HoldingSort } from '@/types/portfolio';

// '전체'는 기본 정렬인 평가금액 많은순입니다.
// 보유 종목 응답에 거래량·상장일이 없어 화면설계서의 거래량 많은순·최근 상장순은 백엔드 필드 추가 후 넣습니다.
export const HOLDING_SORT_OPTIONS: { label: string; value: HoldingSort }[] = [
  { label: '전체', value: 'valuation' },
  { label: '수익률 높은순', value: 'rateDesc' },
  { label: '수익률 낮은순', value: 'rateAsc' },
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
