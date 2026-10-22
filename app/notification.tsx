import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NotificationEmpty } from '@/components/notification/NotificationEmpty';
import { NotificationItem } from '@/components/notification/NotificationItem';
import { TopBar } from '@/components/TopBar';
import { useNotificationPreviewStore } from '@/stores/useNotificationPreviewStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function NotificationScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const notifications = useNotificationPreviewStore((state) => state.notifications);
  const markAsRead = useNotificationPreviewStore((state) => state.markAsRead);

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="알림" onBack={handleBack} />

      {notifications.length > 0 ? (
        <ScrollView
          onScroll={handleScroll}
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
                onPress={() => markAsRead(notification.id)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <NotificationEmpty />
      )}
    </SafeAreaView>
  );
}
