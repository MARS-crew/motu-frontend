import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { cssInterop } from 'nativewind';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LoginHeader } from '@/components/login/LoginHeader';
import {
  ACCOUNT_RESTRICTION_CONTENT,
  getAccountRestrictionType,
} from '@/constants/accountRestriction';

cssInterop(Image, { className: 'style' });

export default function AccountRestrictionScreen() {
  const { type, preview } = useLocalSearchParams<{ type?: string; preview?: string }>();
  const restrictionType = getAccountRestrictionType(type);
  const content = ACCOUNT_RESTRICTION_CONTENT[restrictionType];
  const isLocked = restrictionType === 'locked';
  const handleLogin = () => router.replace('/(auth)/login');
  const handleInquiry = () =>
    router.push({
      pathname: '/(auth)/account-inquiry',
      params: {
        type: restrictionType,
        ...(__DEV__ && preview === 'true' ? { preview: 'true' } : {}),
      },
    });

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      {isLocked ? <View className="h-[48px]" /> : <LoginHeader onBack={handleLogin} />}
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow gap-[20px] px-[24px] pb-[32px] pt-[12px]"
      >
        <View className="h-[56px] w-[56px] items-center justify-center rounded-[28px] bg-motu-bg-secondary">
          <Image
            source={
              isLocked
                ? require('../../assets/icons/accountRestriction/lock.png')
                : require('../../assets/icons/accountRestriction/suspended.png')
            }
            className="h-[26px] w-[26px]"
            contentFit="contain"
            accessible={false}
          />
        </View>
        <View className="gap-[6px]">
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
          >
            {content.title}
          </Text>
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
            {content.description}
          </Text>
        </View>
        <View className="min-h-px flex-1" />
        <View className="gap-[12px]">
          <Button appearance="auth" title="문의하기" />
          <Text className="text-center font-pretendard-medium text-[12px] leading-[18px] text-motu-text-tertiary text-no-font-padding">
            {content.help}
          </Text>
          {isLocked && (
            <Button
              appearance="auth"
              title="다시 로그인"
              variant="secondary"
              onPress={handleLogin}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
