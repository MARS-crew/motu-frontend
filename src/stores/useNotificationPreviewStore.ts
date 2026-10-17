import { create } from 'zustand';

import type { AppNotification } from '@/types/notification';

type NotificationPreviewState = {
  notifications: AppNotification[];
  markAsRead: (id: number) => void;
};

// 퍼블리싱 확인용 메모리 상태입니다. 서버 연동 시 Query로 대체합니다
// 알림이 없는 화면은 notifications를 빈 배열로 바꿔서 확인합니다.
export const useNotificationPreviewStore = create<NotificationPreviewState>((set) => ({
  notifications: [
    {
      id: 1,
      type: 'trade',
      title: '삼성전자 매수 체결',
      message: '55,200 P에 10주 매수 주문이 체결되었어요.',
      createdAt: '2026/09/30 09:42',
      isRead: false,
    },
    {
      id: 2,
      type: 'target',
      title: '카카오 목표가 도달',
      message: '설정한 목표가 48,000 P에 도달했어요.',
      createdAt: '2026/09/30 09:31',
      isRead: false,
    },
    {
      id: 3,
      type: 'point',
      title: '이벤트 포인트 지급 완료',
      message: '가입 1주년 이벤트 포인트 5,000P가 지급되었어요.',
      createdAt: '2026/09/30 08:15',
      isRead: false,
    },
    {
      id: 4,
      type: 'notice',
      title: '[점검] 9월 17일 새벽 시스템 점검 안내',
      message: '점검 시간 동안 주문·체결 및 입출금이 제한돼요.',
      createdAt: '2026/09/30 06:03',
      isRead: true,
    },
    {
      id: 5,
      type: 'trade',
      title: 'SK하이닉스 매도 체결',
      message: '178,500 P에 5주 매도 주문이 체결되었어요.',
      createdAt: '2026/09/29 18:47',
      isRead: true,
    },
    {
      id: 6,
      type: 'point',
      title: '출금 신청 접수 완료',
      message: '1,000,000 P 출금 신청이 정상 접수되었어요.',
      createdAt: '2026/09/28 14:20',
      isRead: true,
    },
  ],
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    })),
}));
