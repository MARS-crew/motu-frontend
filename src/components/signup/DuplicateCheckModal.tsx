import { Modal, Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';

export type DuplicateCheckResult = {
  field: 'loginId' | 'nickname';
  value: string;
  isAvailable: boolean;
};

type DuplicateCheckModalProps = {
  result: DuplicateCheckResult;
  onClose: () => void;
  onAccept: () => void;
};

export function DuplicateCheckModal({ result, onClose, onAccept }: DuplicateCheckModalProps) {
  const { field, value, isAvailable } = result;
  const label = field === 'loginId' ? '아이디' : '닉네임';
  const description = isAvailable
    ? `${value}은 사용할 수 있습니다.`
    : `이미 사용 중인 ${label}입니다.\n다른 ${field === 'loginId' ? '아이디를' : '닉네임을'} 입력해 주세요.`;

  return (
    <Modal
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      <View className="flex-1 justify-center px-[24px]">
        <Pressable
          accessible={false}
          onPress={onClose}
          className="absolute inset-0 bg-motu-text-primary/[0.55]"
        />
        <View
          accessibilityViewIsModal
          className="w-full max-w-[360px] -translate-y-[63px] gap-[18px] self-center rounded-[20px] bg-motu-surface-card px-[24px] pb-[24px] pt-[28px]"
        >
          <Text
            accessibilityRole="header"
            className="text-center font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding"
          >
            {isAvailable ? '사용 가능한' : '사용할 수 없는'} {label}
          </Text>
          <Text className="text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
            {description}
          </Text>
          {isAvailable ? (
            <View className="flex-row gap-[8px]">
              <View className="flex-1">
                <Button
                  appearance="auth"
                  size="md"
                  variant="secondary"
                  title="취소"
                  onPress={onClose}
                />
              </View>
              <View className="flex-1">
                <Button appearance="auth" size="md" title="사용하기" onPress={onAccept} />
              </View>
            </View>
          ) : (
            <Button appearance="auth" size="md" title="확인" onPress={onClose} />
          )}
        </View>
      </View>
    </Modal>
  );
}
