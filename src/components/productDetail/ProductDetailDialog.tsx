import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type ProductDetailDialogProps = {
  isVisible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

type ProductDetailDialogButtonsProps = {
  secondaryTitle: string;
  primaryTitle: string;
  onSecondaryPress: () => void;
  onPrimaryPress: () => void;
};

export function ProductDetailDialog({
  isVisible,
  title,
  onClose,
  children,
}: ProductDetailDialogProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={isVisible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 items-center justify-center px-7"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${title} 닫기`}
          onPress={onClose}
          className="absolute inset-0 bg-black/40"
        />
        <View
          accessibilityViewIsModal
          className="w-full max-w-[320px] rounded-lg border border-motu-grey-lighter bg-white px-[25px] pb-[25px] pt-[21px]"
        >
          <View className="flex-row items-center justify-between">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-[15px] leading-5 text-motu-black"
            >
              {title}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="닫기"
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full active:opacity-60"
            >
              <Image
                source={require('../../../assets/icons/product/close.svg')}
                contentFit="contain"
                className="h-[18px] w-[18px]"
                accessible={false}
              />
            </Pressable>
          </View>
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export function ProductDetailDialogButtons({
  secondaryTitle,
  primaryTitle,
  onSecondaryPress,
  onPrimaryPress,
}: ProductDetailDialogButtonsProps) {
  return (
    <View className="mt-6 flex-row gap-2">
      <Pressable
        accessibilityRole="button"
        onPress={onSecondaryPress}
        className="h-[45.5px] flex-1 items-center justify-center rounded-md border border-motu-grey-lighter bg-white active:opacity-70"
      >
        <Text className="font-pretendard-bold text-[13px] leading-[18px] text-motu-black">
          {secondaryTitle}
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={onPrimaryPress}
        className="h-11 flex-1 items-center justify-center rounded-lg bg-motu-black active:opacity-80"
      >
        <Text className="font-pretendard-bold text-[13px] leading-[18px] text-white">
          {primaryTitle}
        </Text>
      </Pressable>
    </View>
  );
}
