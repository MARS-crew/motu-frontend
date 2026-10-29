import type { ChartPeriod } from '@/types/product';

export const CHART_PERIOD_OPTIONS: { label: string; value: ChartPeriod }[] = [
  { label: '분', value: 'minute' },
  { label: '시간', value: 'hour' },
  { label: '1일', value: 'day' },
  { label: '1주', value: 'week' },
  { label: '1개월', value: 'month' },
];

// 가격대별 호가 단위입니다. 실제 단위는 상장 심사에서 확정된 값을 서버에서 받습니다.
export const getTickSize = (price: number) => {
  if (price < 1_000) return 1;
  if (price < 5_000) return 5;
  if (price < 50_000) return 50;
  return 100;
};
