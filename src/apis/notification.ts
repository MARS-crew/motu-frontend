import { api } from '@/apis/instance';
import type { ApiResponse } from '@/types/api';
import type { NotificationItem, NotificationPage } from '@/types/notification';

type GetNotificationsParams = {
  page: number;
  size: number;
};

export const getNotifications = async (params: GetNotificationsParams) => {
  const { data } = await api.get<ApiResponse<NotificationPage>>('/notifications', { params });
  return data.data;
};

export const getUnreadNotificationCount = async () => {
  const { data } = await api.get<ApiResponse<{ unreadCount: number }>>(
    '/notifications/unread-count',
  );
  return data.data.unreadCount;
};

export const patchNotificationRead = async (notificationId: number) => {
  const { data } = await api.patch<ApiResponse<NotificationItem>>(
    `/notifications/${notificationId}/read`,
  );
  return data.data;
};
