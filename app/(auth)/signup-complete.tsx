import { Image } from 'expo-image';
import { Redirect, router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { SignupProgress } from '@/components/signup/SignupProgress';
import { useSignupEmailStore } from '@/stores/useSignupEmailStore';

cssInterop(Image, { className: 'style' });

export default function SignupCompleteScreen() {
  const setEmail = useSignupEmailStore((state) => state.setEmail);

  if (!__DEV__) return <Redirect href="/login" />;

  const handleLogin = () => {
    setEmail('');
    router.dismissTo('/login');
  };

  return (
    <AuthFlowLayout title="회원가입" isSummary>
      <SignupProgress step={4} />
      <View className="h-[56px] w-[56px] items-center justify-center rounded-full bg-motu-bg-secondary">
        <Image
          source={require('../../assets/icons/signup/completed.svg')}
          className="h-[26px] w-[26px]"
          contentFit="contain"
          accessible={false}
        />
      </View>
      <View className="gap-[10px]">
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
        >
          회원가입이 완료되었습니다.
        </Text>
        <Text className="font-pretendard-medium text-[14px] leading-[20px] text-motu-text-primary text-no-font-padding">
          가입 시 적용된 초기 포인트가 지급되었습니다.
        </Text>
      </View>
      <View className="gap-[12px] rounded-[14px] border border-motu-border bg-motu-surface-card p-[15px]">
        {[
          ['회원 상태', '정상'],
          ['역할', '일반 사용자'],
        ].map(([label, value]) => (
          <View key={label} className="flex-row items-center justify-between gap-[8px]">
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-tertiary text-no-font-padding">
              {label}
            </Text>
            <Text className="font-pretendard-bold text-[15px] leading-[20px] text-motu-text-primary text-no-font-padding">
              {value}
            </Text>
          </View>
        ))}
      </View>
      <View className="items-center gap-[6px] rounded-[14px] bg-motu-bg-secondary px-[16px] py-[18px]">
        <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
          초기 포인트 지급
        </Text>
        <Text className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding">
          3,000,000P
        </Text>
      </View>
      <View className="min-h-px flex-1" />
      <Button appearance="auth" title="로그인하기" onPress={handleLogin} />
    </AuthFlowLayout>
  );
}
