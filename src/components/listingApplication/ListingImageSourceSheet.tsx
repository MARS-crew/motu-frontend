import { Modal, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';

type ListingImageSourceSheetProps = {
  isVisible: boolean;
  isPicking: boolean;
  onClose: () => void;
  onLibraryPress: () => void;
  onFilePress: () => void;
};

export function ListingImageSourceSheet({
  isVisible,
  isPicking,
  onClose,
  onLibraryPress,
  onFilePress,
}: ListingImageSourceSheetProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-motu-text-primary/55">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="이미지 가져오기 닫기"
          onPress={onClose}
          disabled={isPicking}
          className="absolute inset-0"
        />
        <SafeAreaView
          edges={['bottom']}
          accessibilityViewIsModal
          className="rounded-t-3xl bg-white"
        >
          <View className="gap-4 px-5 pb-7 pt-5">
            <View className="h-1 w-11 self-center rounded-full bg-motu-border" />
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-base leading-[22px] text-motu-text-primary"
            >
              이미지 가져오기
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              파일을 가져올 위치를 선택해 주세요.
            </Text>
            <View className="gap-1.5">
              <Pressable
                accessibilityRole="button"
                disabled={isPicking}
                onPress={onLibraryPress}
                className="rounded-[10px] px-4 py-[14px] active:bg-motu-bg"
              >
                <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-primary">
                  사진 보관함에서 선택
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={isPicking}
                onPress={onFilePress}
                className="rounded-[10px] px-4 py-[14px] active:bg-motu-bg"
              >
                <Text className="font-pretendard-medium text-sm leading-5 text-motu-text-primary">
                  파일에서 선택
                </Text>
              </Pressable>
            </View>
            <Button title="취소" variant="secondary" onPress={onClose} />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
