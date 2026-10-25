import type { NoticeCategory, NoticeItem } from '@/types/notice';

export const NOTICE_PAGE_SIZE = 10;

export const NOTICE_TYPE_LABELS: Record<NoticeItem['type'], NoticeCategory> = {
  ALL: '서비스',
  STOCK: '상품',
};
