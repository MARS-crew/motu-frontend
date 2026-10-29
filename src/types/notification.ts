// 서버 알림 유형입니다. ORDER 주문 체결, PRICE 지정가 도달, LISTING_DRAFT_EXPIRING 상장 신청 임시저장 만료 예정
export type NotificationServerType = 'ORDER' | 'PRICE' | 'LISTING_DRAFT_EXPIRING';

export type NotificationItem = {
  id: number;
  type: NotificationServerType;
  content: string;
  // 이벤트 당시 값입니다. 유형마다 키가 다르고 금액·수량은 문자열로 내려옵니다.
  payload: Record<string, unknown>;
  isRead: boolean;
  readAt: string | null;
  createDate: string;
};

export type NotificationPage = {
  items: NotificationItem[];
  page: number;
  size: number;
  totalCount: number;
};

export type NotificationType = 'trade' | 'target' | 'listing';

export type AppNotification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};
