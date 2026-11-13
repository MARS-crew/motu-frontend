import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LoginHeader } from '@/components/login/LoginHeader';
import { TextField } from '@/components/TextField';
import { newDeviceSchema, type NewDeviceForm } from '@/schemas/newDeviceSchema';

const RESEND_SECONDS = 30;
const EXPIRY_SECONDS = 300;
const MISMATCH_MESSAGE = '인증번호가 일치하지 않습니다.';

type NewDeviceInfoFieldProps = {
  label: string;
  value: string;
};

function NewDeviceInfoField({ label, value }: NewDeviceInfoFieldProps) {
  return (
    <View className="gap-[8px]">
      <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
        {label}
      </Text>
      <View className="h-[50px] justify-center rounded-auth-input bg-motu-border px-[16px]">
        <Text className="font-pretendard-medium text-[14px] leading-[20px] text-motu-text-secondary text-no-font-padding">
          {value}
        </Text>
      </View>
    </View>
  );
}

function formatRemainingTime(seconds: number) {
  return [Math.floor(seconds / 60), seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export default function NewDeviceScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const isErrorPreview = preview === 'error';
  const [sentAt, setSentAt] = useState<number | null>(() =>
    preview === 'sent' || isErrorPreview ? Date.now() - (isErrorPreview ? 10_000 : 0) : null,
  );
  const [now, setNow] = useState(Date.now);
  const [hasCodeError, setHasCodeError] = useState(isErrorPreview);
  const { control, handleSubmit, reset } = useForm<NewDeviceForm>({
    resolver: zodResolver(newDeviceSchema),
    defaultValues: { code: isErrorPreview ? '135791' : '' },
  });
  const code = useWatch({ control, name: 'code' });
  const hasSent = sentAt !== null;
  const elapsed = sentAt === null ? 0 : Math.max(0, Math.floor((now - sentAt) / 1000));
  const resendRemaining = Math.max(0, RESEND_SECONDS - elapsed);
  const codeRemaining = Math.max(0, EXPIRY_SECONDS - elapsed);
  const hasExpired = hasSent && codeRemaining === 0;

  useEffect(() => {
    if (!hasSent || hasExpired) return;
    const timer = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(timer);
  }, [hasSent, hasExpired]);

  // 퍼블리싱 미리보기입니다. 실제 발송·검증이나 로그인 상태 변경을 하지 않습니다.
  if (!__DEV__) return <Redirect href="/(auth)/login" />;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(auth)/login');
  };
  const handleSend = () => {
    const sentTime = Date.now();
    setSentAt(sentTime);
    setNow(sentTime);
    setHasCodeError(false);
    reset({ code: '' });
  };
  const handleConfirm = handleSubmit(() => {
    if (!hasExpired) setHasCodeError(true);
  });

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LoginHeader title="새 기기 로그인" onBack={handleBack} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow gap-[24px] px-[24px] pb-[32px] pt-[12px]"
          keyboardShouldPersistTaps="handled"
        >
          <Text
            accessibilityRole="header"
            className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
          >
            {'새로운 접속 환경을\n확인했습니다.'}
          </Text>
          <View className="gap-[16px]">
            <NewDeviceInfoField
              label="접속 환경"
              value={hasSent ? '확인 불가' : 'Windows · Chrome'}
            />
            <NewDeviceInfoField label="등록 이메일" value="na***@example.com" />
            <Button
              appearance="auth"
              title={
                !hasSent
                  ? '인증번호 보내기'
                  : resendRemaining > 0
                    ? `인증번호 재발송 (${formatRemainingTime(resendRemaining)})`
                    : '인증번호 재발송'
              }
              disabled={hasSent && resendRemaining > 0}
              onPress={handleSend}
            />
            {hasSent && (
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
                  render={({ field: { ref, value, onBlur, onChange } }) => (
                    <TextField
                      variant="auth"
                      label="인증번호"
                      inputRef={ref}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        setHasCodeError(false);
                        onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                      }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="6자리 숫자"
                    />
                  )}
                />
                <View className="gap-[4px]">
                  {(hasCodeError || hasExpired) && (
                    <Text
                      accessibilityRole="alert"
                      className="font-pretendard-medium text-[12px] leading-[20px] text-motu-btn-red text-no-font-padding"
                    >
                      {hasExpired ? '인증번호가 만료되었습니다.' : MISMATCH_MESSAGE}
                    </Text>
                  )}
                  <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                    남은 시간 {formatRemainingTime(codeRemaining)}
                  </Text>
                </View>
              </>
            )}
          </View>
          {hasSent && (
            <>
              <View className="min-h-px flex-1" />
              <Button
                appearance="auth"
                title="인증 확인"
                disabled={code.length !== 6 || hasExpired}
                onPress={handleConfirm}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
