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
