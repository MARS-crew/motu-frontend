import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { MySettingsLayout } from '@/components/my/MySettingsLayout';
import { NotificationPreferenceRow } from '@/components/my/NotificationPreferenceRow';
import { useNotificationPreferencesStore } from '@/stores/useNotificationPreferencesStore';

export default function NotificationSettingsScreen() {
  const { isPushEnabled, isNightPushEnabled, togglePush, toggleNightPush } =
    useNotificationPreferencesStore();

  return (
    <MySettingsLayout title="알림 설정" onBack={() => router.dismissTo('/my')}>
      <View className="gap-[16px]">
        <View className="overflow-hidden rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card">
          <NotificationPreferenceRow
            title="푸시 알림"
            description="주문 체결 알림, 목표가 알림"
            isEnabled={isPushEnabled}
            onToggle={togglePush}
            isPrimary
          />
          <NotificationPreferenceRow
            title="야간 푸시 알림 동의"
            description="야간 중 푸시 알림 (21:00 - 08:00)"
            isEnabled={isPushEnabled && isNightPushEnabled}
            isDisabled={!isPushEnabled}
            onToggle={toggleNightPush}
          />
        </View>
        <Text className="px-[4px] font-pretendard text-[11.5px] leading-[17.25px] text-motu-grey text-no-font-padding">
          야간 푸시 알림 동의는 푸시 알림을 켠 경우에만 설정할 수 있어요.
        </Text>
      </View>
    </MySettingsLayout>
  );
}
