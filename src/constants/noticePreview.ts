import type { NoticeDetail, NoticeListItem } from '@/types/notice';

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

const NOTICE_CONTENTS: Record<number, string> = {
  1: `안녕하세요. 모투(MOTU)입니다.

보다 안정적인 서비스 제공을 위해 아래와 같이 시스템 점검이 진행됩니다.

■ 점검 일시
2026년 9월 17일(목) 02:00 ~ 05:00 (약 3시간)

■ 점검 영향
· 주문 및 체결 일시 중단
· 입출금 신청 지연
· 자산 조회 일시 제한

점검 시간 동안에는 서비스 이용이 제한되오니 양해 부탁드립니다. 점검이 완료되는 대로 공지사항을 통해 안내드리겠습니다.

감사합니다.
모투(MOTU) 운영팀`,
};

const DEFAULT_NOTICE_CONTENT = `안녕하세요. 모투(MOTU)입니다.

공지 내용은 서버 연동 후 표시됩니다.

감사합니다.
모투(MOTU) 운영팀`;

export const getNoticeDetail = (id: number): NoticeDetail | null => {
  const notice = NOTICES.find((item) => item.id === id);
  if (!notice) return null;
  return { ...notice, content: NOTICE_CONTENTS[id] ?? DEFAULT_NOTICE_CONTENT };
};
