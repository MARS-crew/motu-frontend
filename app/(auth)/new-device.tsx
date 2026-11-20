import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { FormMessage } from '@/components/FormMessage';
import { LoginHeader } from '@/components/login/LoginHeader';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime } from '@/hooks/useEmailCodeTimer';
import { useVerificationTimer } from '@/hooks/useVerificationTimer';
import {
  useLoginChallengeQuery,
  useLoginDeliveryQuery,
  useSendLoginVerificationMutation,
  useConfirmLoginVerificationMutation,
} from '@/queries/useLoginVerificationMutation';
import { newDeviceSchema, type NewDeviceForm } from '@/schemas/newDeviceSchema';
import { getAuthError } from '@/utils/authError';
import { pendingLoginStorage } from '@/utils/pendingLoginStorage';

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

export default function NewDeviceScreen() {
  const challenge = useLoginChallengeQuery();
  const delivery = useLoginDeliveryQuery();
  const send = useSendLoginVerificationMutation();
  const confirm = useConfirmLoginVerificationMutation();
  const isBusyRef = useRef(false);
  const timer = useVerificationTimer(delivery.data ?? undefined);
  const { control, handleSubmit, reset } = useForm<NewDeviceForm>({
    resolver: zodResolver(newDeviceSchema),
    defaultValues: { code: '' },
  });
  const code = useWatch({ control, name: 'code' });
  const hasSent = Boolean(delivery.data);
  const isBusy = send.isPending || confirm.isPending;
  const error = getAuthError(send.error ?? confirm.error);
  const handleBack = async () => {
    await pendingLoginStorage.clear();
    router.replace('/login');
  };
  const handleSend = async () => {
    if (isBusyRef.current || timer.resendRemaining > 0) return;
    isBusyRef.current = true;
    confirm.reset();
    try {
      await send.mutateAsync();
      reset({ code: '' });
    } catch {
      /* 서버 오류만 표시합니다. */
    } finally {
      isBusyRef.current = false;
    }
  };
  const handleConfirm = async () => {
    if (isBusyRef.current || timer.hasExpired) return;
    isBusyRef.current = true;
    send.reset();
    try {
      await handleSubmit(async ({ code }) => {
        await confirm.mutateAsync(code);
      })();
    } catch {
      /* 서버 오류만 표시합니다. */
    } finally {
      isBusyRef.current = false;
    }
  };
  if (challenge.isPending) return null;
  if (!challenge.data) return <Redirect href="/login" />;
  if (error?.code === 'AUTH_INVALID_LOGIN_TOKEN') return <Redirect href="/login" />;
  const target = delivery.data ?? challenge.data;
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
              label={target.method === 'EMAIL' ? '등록 이메일' : '등록 휴대폰'}
              value={target.maskedTarget}
            />
            <Button
              appearance="auth"
              title={
                !hasSent
                  ? '인증번호 보내기'
                  : timer.resendRemaining > 0
                    ? `인증번호 재발송 (${formatEmailCodeTime(timer.resendRemaining)})`
                    : '인증번호 재발송'
              }
              disabled={isBusy || timer.resendRemaining > 0}
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
                        confirm.reset();
                        onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                      }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="6자리 숫자"
                      editable={!isBusy}
                      errorMessage={timer.hasExpired ? '인증번호가 만료되었습니다.' : undefined}
                    />
                  )}
                />
                <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
                  남은 시간 {formatEmailCodeTime(timer.remaining)}
                </Text>
              </>
            )}
            <FormMessage message={error?.message} isError size="double" />
          </View>
          {hasSent && (
            <>
              <View className="min-h-px flex-1" />
              <Button
                appearance="auth"
                title="인증 확인"
                disabled={code.length !== 6 || timer.hasExpired || isBusy}
                onPress={handleConfirm}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
