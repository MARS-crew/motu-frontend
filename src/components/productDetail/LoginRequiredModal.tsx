import { Text } from 'react-native';

import { AuthNoticeDialog } from '@/components/login/AuthNoticeDialog';

export type LoginRequiredReason = 'order' | 'favorite' | 'priceAlert';

type LoginRequiredModalProps = {
  reason: LoginRequiredReason | null;
  onClose: () => void;
  onLoginPress: () => void;
};

const LOGIN_REQUIRED_DESCRIPTION = {
  order: '‘주문하기’는 로그인 후 이용할 수 있어요.',
  favorite: '‘관심상품’은 로그인 후 이용할 수 있어요.',
  priceAlert: '‘가격 알림’은 로그인 후 이용할 수 있어요.',
} as const;

export function LoginRequiredModal({ reason, onClose, onLoginPress }: LoginRequiredModalProps) {
  if (!reason) return null;

  return (
    <AuthNoticeDialog
      isVisible
      onClose={onClose}
      onPrimaryPress={onLoginPress}
      secondaryTitle="취소"
      primaryTitle="로그인"
      footer={
        <Text className="text-center font-pretendard-medium text-[12px] leading-[16px] text-motu-text-tertiary text-no-font-padding">
          회원이 아니신가요?{'  '}
          <Text className="text-motu-text-primary">회원가입</Text>
        </Text>
      }
    >
      <Text
        accessibilityRole="header"
        className="text-center font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding"
      >
        로그인이 필요한 기능입니다.
      </Text>
      <Text className="text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
        {LOGIN_REQUIRED_DESCRIPTION[reason]}
      </Text>
    </AuthNoticeDialog>
  );
}
