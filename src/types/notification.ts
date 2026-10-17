export type NotificationType = 'trade' | 'target' | 'point' | 'notice';

export type AppNotification = {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};
