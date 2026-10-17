import type { NoticeListItem } from '@/types/notice';

export const NOTICE_PAGE_SIZE = 10;

// 퍼블리싱 확인용 데이터입니다. 서버 연동 시 Query로 대체합니다
// 공지가 없는 화면은 빈 배열로 바꿔서 확인합니다.
export const NOTICES: NoticeListItem[] = [
  {
    id: 1,
    title: '[점검] 9월 17일 새벽 시스템 점검 안내',
    category: '서비스',
    isImportant: true,
    createdAt: '2026.09.12',
  },
  {
    id: 2,
    title: '모투 앱 3.2 업데이트 안내',
    category: '서비스',
    isImportant: true,
    createdAt: '2026.09.05',
  },
  {
    id: 3,
    title: '개인정보 처리방침 개정 안내',
    category: '서비스',
    isImportant: false,
    createdAt: '2026.08.28',
  },
  {
    id: 4,
    title: '여름 휴가 기간 고객센터 운영 안내',
    category: '서비스',
    isImportant: false,
    createdAt: '2026.08.15',
  },
  {
    id: 5,
    title: '수수료 정책 개편 안내',
    category: '상품',
    isImportant: false,
    createdAt: '2026.08.01',
  },
  {
    id: 6,
    title: 'PLI 거래 일시 정지 안내',
    category: '상품',
    isImportant: false,
    createdAt: '2026.07.28',
  },
  {
    id: 7,
    title: 'CloudWorks 거래 재개 안내',
    category: '상품',
    isImportant: false,
    createdAt: '2026.07.20',
  },
  {
    id: 8,
    title: '신규 상장 상품 목록 안내',
    category: '상품',
    isImportant: false,
    createdAt: '2026.07.12',
  },
  {
    id: 9,
    title: '이용약관 개정 안내',
    category: '서비스',
    isImportant: false,
    createdAt: '2026.07.01',
  },
  {
    id: 10,
    title: '모의투자 포인트 지급 정책 안내',
    category: '서비스',
    isImportant: false,
    createdAt: '2026.06.24',
  },
  {
    id: 11,
    title: '서비스 점검 안내',
    category: '서비스',
    isImportant: false,
    createdAt: '2026.06.10',
  },
  {
    id: 12,
    title: 'MOTU(모투) 서비스 시작 안내',
    category: '서비스',
    isImportant: false,
    createdAt: '2026.06.01',
  },
];
