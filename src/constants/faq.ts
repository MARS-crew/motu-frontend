import type { FaqCategory, FaqCategoryCode, FaqFilter, FaqFilterCode } from '@/types/faq';

// 화면설계서 기준으로 고정된 필터 항목입니다. 서버에는 code로 요청합니다.
export const FAQ_FILTERS: { label: FaqFilter; code: FaqFilterCode }[] = [
  { label: '전체', code: 'ALL' },
  { label: '거래/주문', code: 'TRADE' },
  { label: '포인트/자산', code: 'POINT' },
  { label: '계정/보안', code: 'ACCOUNT' },
  { label: '상장', code: 'LISTING' },
  { label: '기타', code: 'ETC' },
];

export const FAQ_CATEGORY_LABELS: Record<FaqCategoryCode, FaqCategory> = {
  TRADE: '거래/주문',
  POINT: '포인트/자산',
  ACCOUNT: '계정/보안',
  LISTING: '상장',
  ETC: '기타',
};
