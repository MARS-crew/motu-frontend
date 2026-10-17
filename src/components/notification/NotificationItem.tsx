import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { AppNotification, NotificationType } from '@/types/notification';

cssInterop(Image, { className: 'style' });

const TYPE_ICONS: Record<NotificationType, { source: number; className: string }> = {
  trade: {
    source: require('../../../assets/icons/notification/trade.svg'),
    className: 'bg-motu-red/10',
  },
  target: {
    source: require('../../../assets/icons/notification/target.svg'),
    className: 'bg-motu-green/10',
  },
  point: {
    source: require('../../../assets/icons/notification/wallet.svg'),
    className: 'bg-motu-grey-lighter',
  },
  notice: {
    source: require('../../../assets/icons/notification/notice.svg'),
    className: 'bg-motu-black/5',
  },
};

type NotificationItemProps = {
  notification: AppNotification;
  onPress: () => void;
};

export function NotificationItem({ notification, onPress }: NotificationItemProps) {
  const { isRead } = notification;
  const icon = TYPE_ICONS[notification.type];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${notification.title}${isRead ? '' : ', 읽지 않음'}`}
      onPress={onPress}
      className={`flex-row items-start gap-3 rounded-2xl border px-4 py-3.5 active:opacity-80 ${
        isRead ? 'border-motu-grey-lighter bg-motu-bg' : 'border-motu-grey-light/60 bg-white'
      }`}
    >
      <View className={`h-9 w-9 items-center justify-center rounded-full ${icon.className}`}>
        <Image source={icon.source} contentFit="contain" className="h-[18px] w-[18px]" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          <Text
            numberOfLines={1}
            className={`flex-shrink text-[13px] leading-[20.25px] ${
              isRead
                ? 'font-pretendard-medium text-motu-grey'
                : 'font-pretendard-bold text-motu-black'
            }`}
          >
            {notification.title}
          </Text>
          {!isRead && <View className="h-1.5 w-1.5 rounded-full bg-motu-red" />}
        </View>
        <Text
          numberOfLines={1}
          className="mt-1 font-pretendard-medium text-xs leading-[18px] text-motu-grey"
        >
          {notification.message}
        </Text>
        <Text className="mt-1.5 font-pretendard-medium text-[11px] leading-[16.5px] text-motu-grey-light">
          {notification.createdAt}
        </Text>
      </View>
    </Pressable>
  );
}
