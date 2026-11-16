import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginHeader } from '@/components/login/LoginHeader';

type AuthFlowLayoutProps = {
  title: string;
  onBack?: () => void;
  children: ReactNode;
  isSummary?: boolean;
};

export function AuthFlowLayout({ title, onBack, children, isSummary }: AuthFlowLayoutProps) {
  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {onBack ? (
          <LoginHeader title={title} onBack={onBack} />
        ) : (
          <View className="h-[48px] justify-center px-[24px] pb-[8px] pt-[16px]">
            <Text className="font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding">
              {title}
            </Text>
          </View>
        )}
        <ScrollView
          className="flex-1"
          contentContainerClassName={`grow px-[24px] pt-[12px] ${isSummary ? 'gap-[20px] pb-[28px]' : 'gap-[24px] pb-[32px]'}`}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type AuthFlowHeadingProps = {
  title: string;
  description?: string;
};

export function AuthFlowHeading({ title, description }: AuthFlowHeadingProps) {
  return (
    <View className="gap-[6px]">
      <Text
        accessibilityRole="header"
        className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
      >
        {title}
      </Text>
      {description && (
        <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
          {description}
        </Text>
      )}
    </View>
  );
}

export function AuthFlowBadge({ children }: { children: string }) {
  return (
    <View className="self-start rounded-full bg-motu-success-light px-[12px] py-[6px]">
      <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-success text-no-font-padding">
        {children}
      </Text>
    </View>
  );
}
