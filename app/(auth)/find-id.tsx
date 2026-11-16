import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowBadge, AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime, useEmailCodeTimer } from '@/hooks/useEmailCodeTimer';
import { findIdSchema, type FindIdForm } from '@/schemas/accountRecoverySchema';

const RESEND_SECONDS = 30;
const PREVIEW_CODE = '135790';

export default function FindIdScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const [status, setStatus] = useState<'input' | 'no-match' | 'result'>('input');
  const timer = useEmailCodeTimer(RESEND_SECONDS);
  const {
    control,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FindIdForm>({
    defaultValues: { email: '', code: '' },
  });
  const [email, code] = useWatch({ control, name: ['email', 'code'] });

  if (!__DEV__) return <Redirect href="/login" />;

  const handleLogin = () => router.dismissTo('/login');
  const handleBack = () => (router.canGoBack() ? router.back() : handleLogin());
  const handleEmailChange = (value: string) => {
    setValue('email', value);
    setValue('code', '');
    clearErrors();
    timer.reset();
    setStatus('input');
  };
  const handleSend = () => {
    if (timer.hasSent && timer.resendRemaining > 0) return;
    const parsed = findIdSchema.shape.email.safeParse(email.trim());
    if (!parsed.success) {
      setError('email', { message: parsed.error.issues[0]?.message });
      return;
    }
    if (preview === 'no-match') {
      setStatus('no-match');
      return;
    }
    clearErrors();
    setValue('code', '');
    timer.start();
  };
  const handleVerify = () => {
    if (!timer.isCurrent() || !findIdSchema.shape.code.safeParse(code).success) return;
    if (code !== PREVIEW_CODE) {
      setError('code', { message: '인증번호가 일치하지 않습니다.' });
      return;
    }
    timer.reset();
    setStatus('result');
  };

  if (status === 'result') {
    return (
      <AuthFlowLayout title="아이디 찾기 결과">
        <AuthFlowBadge>인증 완료</AuthFlowBadge>
        <AuthFlowHeading
          title="아이디를 확인했습니다."
          description="보안을 위해 아이디 일부를 가려서 표시합니다."
        />
        <View className="items-center gap-[8px] rounded-[14px] bg-motu-bg-secondary p-[24px]">
          <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
            가입한 아이디
          </Text>
          <Text className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding">
            jin***613
          </Text>
        </View>
        <View className="flex-1" />
        <View className="gap-[12px]">
          <Button appearance="auth" title="로그인" onPress={handleLogin} />
          <Button
            appearance="auth"
            variant="secondary"
            title="비밀번호 재설정"
            onPress={() => router.replace('/reset-password')}
          />
        </View>
      </AuthFlowLayout>
    );
  }

  return (
    <AuthFlowLayout title="아이디 찾기" onBack={handleBack}>
      <AuthFlowHeading title="가입 이메일로 아이디를 찾습니다." />
      <View className="gap-[16px]">
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onBlur, ref } }) => (
            <TextField
              variant="auth"
              label="가입 이메일"
              inputRef={ref}
              value={value}
              onChangeText={handleEmailChange}
              onBlur={onBlur}
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="name@example.com"
              errorMessage={errors.email?.message}
            />
          )}
        />
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
                    clearErrors('code');
                    onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                  }}
                  onBlur={onBlur}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6자리 숫자"
                  errorMessage={
                    timer.hasExpired ? '인증번호가 만료되었습니다.' : errors.code?.message
                  }
                />
              )}
            />
            <Text className="-mt-[8px] font-pretendard-medium text-[12px] leading-[16px] text-motu-text-tertiary text-no-font-padding">
              남은 시간 {formatEmailCodeTime(timer.remaining)}
            </Text>
            <Button
              appearance="auth"
              title="아이디 확인"
              disabled={code.length !== 6 || timer.hasExpired}
              onPress={handleVerify}
            />
          </>
        )}
      </View>
      {status === 'no-match' && (
        <>
          <View className="items-center gap-[6px] rounded-[14px] bg-motu-surface-card px-[16px] py-[20px]">
            <Text
              accessibilityRole="alert"
              className="text-center font-pretendard-bold text-[16px] leading-[22px] text-motu-text-primary text-no-font-padding"
            >
              일치하는 계정이 없습니다.
            </Text>
            <Text className="text-center font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
              이메일을 확인한 뒤 다시 시도해 주세요.
            </Text>
          </View>
          <View className="flex-1" />
          <View className="gap-[10px]">
            <Button
              appearance="auth"
              title="이메일 다시 입력"
              onPress={() => handleEmailChange('')}
            />
            <Button
              appearance="auth"
              variant="secondary"
              size="md"
              title="로그인으로 돌아가기"
              onPress={handleLogin}
            />
          </View>
        </>
      )}
    </AuthFlowLayout>
  );
}
