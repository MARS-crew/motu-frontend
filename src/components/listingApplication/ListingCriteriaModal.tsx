import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LISTING_CRITERIA } from '@/constants/listingApplicationPreview';

type ListingCriteriaModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function ListingCriteriaModal({ isVisible, onClose }: ListingCriteriaModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-motu-black/60">
        <ScrollView
          className="flex-1"
          contentContainerClassName="relative flex-grow items-center justify-center px-6 py-10"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="상장 기준 창 닫기"
            onPress={onClose}
            className="absolute inset-0"
          />
          <View accessibilityViewIsModal className="w-full max-w-md rounded-[20px] bg-white p-6">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-base text-motu-text-primary"
            >
              상장 기준
            </Text>
            <Text className="mt-3 font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              신청 전에 다음 내용을 확인해 주세요.
            </Text>
            <View className="mt-3 gap-2 rounded-[10px] bg-motu-bg-secondary p-[14px]">
              {LISTING_CRITERIA.map((criterion, index) => (
                <Text
                  key={criterion}
                  className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-primary"
                >
                  {index + 1}. {criterion}
                </Text>
              ))}
            </View>
            <View className="mt-3">
              <Button title="확인" size="md" onPress={onClose} />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
