import { Modal, Pressable, Text, View } from 'react-native';

type SecondFactorReleaseModalProps = {
  onClose: () => void;
  onRelease: () => void;
};

export function SecondFactorReleaseModal({ onClose, onRelease }: SecondFactorReleaseModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center px-[28px]">
        <Pressable
          accessible={false}
          onPress={onClose}
          className="absolute inset-0 bg-motu-overlay/40"
        />
        <View
          accessibilityViewIsModal
          className="w-full max-w-[320px] gap-[12px] rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card px-[25px] py-[20px]"
        >
          <Text
            accessibilityRole="header"
            className="text-center font-pretendard-bold text-[16px] leading-[24px] text-motu-black text-no-font-padding"
          >
            2차 보안을 해제할까요?
          </Text>
          <Text className="text-center font-pretendard text-[13px] leading-[20px] text-motu-grey text-no-font-padding">
            {
              '해제 후 중요한 작업을 하려면\n휴대폰 번호 등록과 SMS 인증이\n다시 필요할 수 있습니다.'
            }
          </Text>
          <View className="mt-[4px] flex-row gap-[8px]">
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-[46px] flex-1 items-center justify-center rounded-[8px] border border-motu-grey-lighter bg-motu-surface-card"
            >
              <Text className="font-pretendard-semibold text-[13px] leading-[20px] text-motu-black text-no-font-padding">
                취소
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onRelease}
              className="h-[46px] flex-1 items-center justify-center rounded-[8px] bg-motu-btn-red"
            >
              <Text className="font-pretendard-semibold text-[13px] leading-[20px] text-motu-on-cta text-no-font-padding">
                해제
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
