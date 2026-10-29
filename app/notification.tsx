import { router } from 'expo-router';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { NotificationEmpty } from '@/components/notification/NotificationEmpty';
import { NotificationItem } from '@/components/notification/NotificationItem';
import { TopBar } from '@/components/TopBar';
import { useNotificationsQuery } from '@/queries/useNotificationsQuery';
import { useReadNotificationMutation } from '@/queries/useReadNotificationMutation';
import { useUnreadNotificationCountQuery } from '@/queries/useUnreadNotificationCountQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import type { AppNotification } from '@/types/notification';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { isNearBottom } from '@/utils/scroll';

export default function NotificationScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const {
    data: notifications = [],
    isPending,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotificationsQuery();
  const { data: unreadCount = 0 } = useUnreadNotificationCountQuery();
  const { mutate: readNotification } = useReadNotificationMutation();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // 미확인 알림만 읽음 처리합니다.
  const handleNotificationPress = (notification: AppNotification) => {
    if (!notification.isRead) readNotification(notification.id);
  };

  const handleScrollWithLoadMore = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    handleScroll(event);
    if (isNearBottom(event) && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  };

  const renderBody = () => {
    if (!isLoggedIn) {
      return (
        <View className="px-6 pt-3">
          <LoginRequiredBox />
        </View>
      );
    }

    if (isPending) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      );
    }

    if (isError) {
      return (
        <Text className="pt-[104px] text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          알림을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Text>
      );
    }

    if (notifications.length === 0) return <NotificationEmpty />;

    return (
      <ScrollView
        onScroll={handleScrollWithLoadMore}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="px-6 pb-8 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <Text
          accessibilityRole="header"
          className="mb-3 font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black"
        >
          새 알림 {unreadCount > 0 && <Text className="text-motu-red">{unreadCount}</Text>}
        </Text>
        <View className="gap-2.5">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleNotificationPress(notification)}
            />
          ))}
        </View>
        {isFetchingNextPage && <ActivityIndicator className="py-4" />}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="알림" onBack={handleBack} />

      {renderBody()}
    </SafeAreaView>
  );
}
