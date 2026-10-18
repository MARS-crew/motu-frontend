import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { LISTING_RESTRICTION_LABEL } from '@/constants/listingRestrictionPreview';

cssInterop(Image, { className: 'style' });

type ListingRestrictionModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onDetailsPress: () => void;
};

export function ListingRestrictionModal({
  isVisible,
  onClose,
  onDetailsPress,
}: ListingRestrictionModalProps) {
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
            accessibilityLabel="상장 신청 제한 안내 닫기"
            onPress={onClose}
            className="absolute inset-0"
          />
          <View
            accessibilityViewIsModal
            className="w-full max-w-md items-center rounded-[20px] bg-white p-6"
          >
            <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-red-light">
              <Image
                source={require('../../../assets/icons/listingApplication/restrictionAlert.svg')}
                contentFit="contain"
                className="h-6 w-[9px]"
                accessible={false}
              />
            </View>
            <View className="mt-4 rounded-full bg-motu-red-light px-[14px] py-1.5">
              <Text className="font-pretendard-medium text-xs text-motu-btn-red">
                {LISTING_RESTRICTION_LABEL}
              </Text>
            </View>
            <Text
              accessibilityRole="header"
              className="mt-3 text-center font-pretendard-bold text-lg leading-6 text-motu-text-primary"
            >
              현재 계정은 상장 신청이 제한됩니다.
            </Text>
            <Text className="mt-2 text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
              잠금·정지 사유와 해제 방법을 확인해 주세요.
            </Text>
            <View className="mt-4 w-full rounded-[10px] bg-motu-red-light py-[10px]">
              <Text className="text-center font-pretendard-medium text-[11px] text-motu-red">
                신청 전 제한 사유를 확인해 주세요.
              </Text>
            </View>
            <View className="mt-5 w-full flex-row gap-2">
              <View className="flex-1">
                <Button title="문의하기" variant="secondary" size="md" />
              </View>
              <View className="flex-1">
                <Button title="상세보기" color="red" size="md" onPress={onDetailsPress} />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
