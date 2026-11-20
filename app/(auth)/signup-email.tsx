import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { SignupProgress } from '@/components/signup/SignupProgress';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime, useEmailCodeTimer } from '@/hooks/useEmailCodeTimer';
import { newDeviceSchema, type NewDeviceForm } from '@/schemas/newDeviceSchema';
import { useSignupEmailStore } from '@/stores/useSignupEmailStore';

const SIGNUP_RESEND_SECONDS = 20;
const PREVIEW_CODE = '135790';

export default function SignupEmailScreen() {
  const signupEmail = useSignupEmailStore((state) => state.email);
  const [isVerified, setIsVerified] = useState(false);
  const [hasCodeError, setHasCodeError] = useState(false);
  const timer = useEmailCodeTimer(SIGNUP_RESEND_SECONDS);
  const { control, handleSubmit, reset } = useForm<NewDeviceForm>({
    resolver: zodResolver(newDeviceSchema),
    defaultValues: { code: '' },
  });
  const code = useWatch({ control, name: 'code' });

  if (!__DEV__) return <Redirect href="/signup-info" />;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/signup-info');
  };
  const handleSend = () => {
    if (timer.hasSent && timer.resendRemaining > 0) return;
    reset({ code: '' });
    setHasCodeError(false);
    timer.start();
  };
  const handleVerify = handleSubmit(({ code }) => {
    if (!timer.isCurrent()) return;
    if (code === PREVIEW_CODE) {
      timer.reset();
      setIsVerified(true);
      return;
    }
    setHasCodeError(true);
  });

  return (
    <AuthFlowLayout title="회원가입" onBack={handleBack}>
      <SignupProgress step={3} />
      <AuthFlowHeading title={'인증번호를 받을 이메일을\n확인해 주세요.'} />
      <View className="gap-[16px]">
        <View className="gap-[8px]">
          <View className="flex-row items-center justify-between gap-[8px]">
            <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
              가입 이메일
            </Text>
            <Pressable accessibilityRole="button" onPress={handleBack}>
              <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-primary underline text-no-font-padding">
                이메일 수정
              </Text>
            </Pressable>
          </View>
          <View className="min-h-[50px] justify-center rounded-auth-input bg-motu-border px-[16px] py-[8px]">
            <Text className="font-pretendard-medium text-[14px] leading-[20px] text-motu-text-secondary text-no-font-padding">
              {signupEmail || 'name@example.com'}
            </Text>
          </View>
        </View>
        {isVerified ? (
          <Text
            accessibilityLiveRegion="polite"
            className="font-pretendard-medium text-[12px] leading-[20px] text-motu-success text-no-font-padding"
          >
            이메일 인증이 완료되었습니다.
          </Text>
        ) : (
          <>
            <Button
              appearance="auth"
              title={
                !timer.hasSent
                  ? '인증번호 보내기'
                  : timer.resendRemaining > 0
                    ? `인증번호 재발송 (${formatEmailCodeTime(timer.resendRemaining)})`
                    : '인증번호 재발송'
              }
              disabled={timer.hasSent && timer.resendRemaining > 0}
              onPress={handleSend}
            />
            {timer.hasSent && (
              <>
                <Text
                  accessibilityLiveRegion="polite"
                  className="font-pretendard-medium text-[12px] leading-[20px] text-motu-success text-no-font-padding"
                >
                  인증번호를 발송했습니다.
                </Text>
                <View className="gap-[4px]">
                  <Controller
                    control={control}
                    name="code"
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <TextField
                        variant="auth"
                        label="인증번호"
                        inputRef={ref}
                        value={value}
                        onChangeText={(text) => {
                          setHasCodeError(false);
                          onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                        }}
                        onBlur={onBlur}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="6자리 숫자"
                        errorMessage={
                          hasCodeError || timer.hasExpired
                            ? timer.hasExpired
                              ? '인증번호가 만료되었습니다.'
                              : '인증번호가 일치하지 않습니다.'
                            : undefined
                        }
                      />
                    )}
                  />
                  <Text className="mt-[4px] font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                    남은 시간 {formatEmailCodeTime(timer.remaining)}
                  </Text>
                </View>
              </>
            )}
          </>
        )}
      </View>
      <View className="min-h-px flex-1" />
      {isVerified ? (
        <Button appearance="auth" title="다음" onPress={() => router.replace('/signup-complete')} />
      ) : (
        timer.hasSent && (
          <Button
            appearance="auth"
            title="인증 확인"
            disabled={code.length !== 6 || timer.hasExpired}
            onPress={handleVerify}
          />
        )
      )}
    </AuthFlowLayout>
  );
}
