import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

cssInterop(Image, { className: 'style' });

type MySettingsLayoutProps = {
  title: string;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
  overlay?: ReactNode;
};

export function MySettingsLayout({
  title,
  onBack,
  children,
  footer,
  overlay,
}: MySettingsLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="h-[84px] shrink-0 flex-row items-center gap-[4px] px-[16px] pb-[16px] pt-[32px]">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            onPress={onBack}
            hitSlop={4}
            className="h-[36px] w-[36px] items-center justify-center"
          >
            <Image
              source={require('../../../assets/icons/my/security/back.svg')}
              className="h-[24px] w-[24px]"
              contentFit="contain"
              accessible={false}
            />
          </Pressable>
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-[17px] leading-[25.5px] text-motu-black text-no-font-padding"
          >
            {title}
          </Text>
        </View>
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-[24px] pb-[24px] pt-[4px]"
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
        {footer}
        {overlay}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
