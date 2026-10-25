export type NoticeCategory = '서비스' | '상품';

export type NoticeListItem = {
  id: number;
  title: string;
  category: NoticeCategory;
  isImportant: boolean;
  createdAt: string;
};

export type NoticeDetail = NoticeListItem & {
  content: string;
};

// 공지 API 응답 타입입니다. (스웨거 NoticeItemResDto 기준)
export type NoticeItem = {
  noticeId: number;
  type: 'ALL' | 'STOCK';
  title: string;
  isImportant: boolean;
  postDate: string;
};
