import { Text } from 'react-native';

import { AuthNoticeDialog } from '@/components/login/AuthNoticeDialog';

type SecuritySetupModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onSetupPress: () => void;
};

export function SecuritySetupModal({ isVisible, onClose, onSetupPress }: SecuritySetupModalProps) {
  return (
    <AuthNoticeDialog
      isVisible={isVisible}
      onClose={onClose}
      onPrimaryPress={onSetupPress}
      secondaryTitle="나중에"
      primaryTitle="설정하기"
    >
      <Text className="text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
        로그인이 완료되었습니다.
      </Text>
      <Text
        accessibilityRole="header"
        className="text-center font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding"
      >
        {'2차 보안을 설정해\n계정을 보호하세요.'}
      </Text>
    </AuthNoticeDialog>
  );
}
