import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';

import { Button } from '@/components/Button';

type AuthNoticeDialogProps = {
  isVisible: boolean;
  onClose: () => void;
  onPrimaryPress: () => void;
  secondaryTitle: string;
  primaryTitle: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthNoticeDialog({
  isVisible,
  onClose,
  onPrimaryPress,
  secondaryTitle,
  primaryTitle,
  children,
  footer,
}: AuthNoticeDialogProps) {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View className="flex-1 items-center justify-center px-[24px]">
        <Pressable
          accessible={false}
          onPress={onClose}
          className="absolute inset-0 bg-motu-text-primary/[0.55]"
        />
        <View
          accessibilityViewIsModal
          className="w-full max-w-[360px] gap-[20px] rounded-[20px] bg-motu-surface-card px-[24px] pb-[24px] pt-[28px]"
        >
          {children}
          <View className="flex-row gap-[8px]">
            <View className="flex-1">
              <Button
                appearance="auth"
                size="md"
                variant="secondary"
                title={secondaryTitle}
                onPress={onClose}
              />
            </View>
            <View className="flex-1">
              <Button appearance="auth" size="md" title={primaryTitle} onPress={onPrimaryPress} />
            </View>
          </View>
          {footer}
        </View>
      </View>
    </Modal>
  );
}
