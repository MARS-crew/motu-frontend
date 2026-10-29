import type {
  AppNotification,
  NotificationItem,
  NotificationServerType,
  NotificationType,
} from '@/types/notification';
import { formatSlashDateTime } from '@/utils/formatDate';

const NOTIFICATION_TYPES: Record<NotificationServerType, NotificationType> = {
  ORDER: 'trade',
  PRICE: 'target',
  LISTING_DRAFT_EXPIRING: 'listing',
};

const getPayloadText = (payload: Record<string, unknown>, key: string) => {
  const value = payload[key];
  return typeof value === 'string' ? value : '';
};

// 서버는 알림 내용(content)만 내려주므로 제목은 payload 값으로 만듭니다.
const getNotificationTitle = ({ type, payload }: NotificationItem) => {
  const stockName = getPayloadText(payload, 'stockName');

  if (type === 'ORDER') {
    const sideLabel = getPayloadText(payload, 'side') === 'SELL' ? '매도' : '매수';
    return `${stockName} ${sideLabel} 체결`.trim();
  }
  if (type === 'PRICE') return `${stockName} 목표가 도달`.trim();
  return '상장 신청 임시저장 만료 예정';
};

// 알림 API 응답을 화면에서 쓰는 형태로 바꿉니다.
export const toAppNotification = (notification: NotificationItem): AppNotification => ({
  id: notification.id,
  type: NOTIFICATION_TYPES[notification.type],
  title: getNotificationTitle(notification),
  message: notification.content,
  createdAt: formatSlashDateTime(notification.createDate),
  isRead: notification.isRead,
});
