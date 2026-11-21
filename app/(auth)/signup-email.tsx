import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { SignupProgress } from '@/components/signup/SignupProgress';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime } from '@/hooks/useEmailCodeTimer';
import { newDeviceSchema, type NewDeviceForm } from '@/schemas/newDeviceSchema';
import { FormMessage } from '@/components/FormMessage';
import { useVerificationTimer } from '@/hooks/useVerificationTimer';
import { useSignupFormStore } from '@/stores/useSignupFormStore';
import { signupConsentSchema } from '@/schemas/signupConsentSchema';
import {
  useSignupEmailDeliveryQuery,
  useSendSignupEmailMutation,
  useConfirmSignupEmailMutation,
  useSignupMutation,
} from '@/queries/useSignupEmailMutation';
import { getAuthError } from '@/utils/authError';

export default function SignupEmailScreen() {
  const info = useSignupFormStore((state) => state.info);
  const consent = useSignupFormStore((state) => state.consent);
  const clearForm = useSignupFormStore((state) => state.reset);
  const signupEmail = info?.email ?? '';
  const delivery = useSignupEmailDeliveryQuery(signupEmail);
  const send = useSendSignupEmailMutation();
  const confirm = useConfirmSignupEmailMutation();
  const signup = useSignupMutation();
  const isBusyRef = useRef(false);
  const timer = useVerificationTimer(delivery.data ?? undefined);
  const hasSent = Boolean(delivery.data);
  const isVerified = confirm.data?.verified === true;
  const isBusy = send.isPending || confirm.isPending || signup.isPending;
  const serverError = getAuthError(send.error ?? confirm.error ?? signup.error);
  const { control, handleSubmit, reset } = useForm<NewDeviceForm>({
    resolver: zodResolver(newDeviceSchema),
    defaultValues: { code: '' },
  });
  const code = useWatch({ control, name: 'code' });
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/signup-info');
  };
  const handleSend = async () => {
    if (isBusyRef.current || timer.resendRemaining > 0) return;
    isBusyRef.current = true;
    confirm.reset();
    signup.reset();
    try {
      await send.mutateAsync(signupEmail);
      reset({ code: '' });
    } catch {
      /* 서버에서 받은 오류만 표시합니다. */
    } finally {
      isBusyRef.current = false;
    }
  };
  const handleVerify = async () => {
    if (isBusyRef.current || timer.hasExpired) return;
    isBusyRef.current = true;
    send.reset();
    try {
      await handleSubmit(async ({ code }) => {
        await confirm.mutateAsync({ email: signupEmail, code });
      })();
    } catch {
      /* 서버에서 받은 오류만 표시합니다. */
    } finally {
      isBusyRef.current = false;
    }
  };
  const handleSignup = async () => {
    if (isBusyRef.current || !isVerified || !info) return;
    isBusyRef.current = true;
    try {
      const { confirmPassword: _confirmation, phone, ...values } = info;
      await signup.mutateAsync({
        ...values,
        ...signupConsentSchema.parse(consent),
        ...(phone ? { phoneNumber: phone } : {}),
      });
      clearForm();
      router.replace('/signup-complete');
    } catch {
      /* 가입 실패 시 입력값을 보존하고 서버 오류만 표시합니다. */
    } finally {
      isBusyRef.current = false;
    }
  };
  if (!signup.isSuccess && !signupConsentSchema.safeParse(consent).success)
    return <Redirect href="/signup" />;
  if (!signup.isSuccess && !info) return <Redirect href="/signup-info" />;
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
              {signupEmail}
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
                <View className="gap-[4px]">
                  <Controller
                    control={control}
                    name="code"
                    render={({ field: { value, onChange, onBlur, ref } }) => (
                      <TextField
                        variant="auth"
                        label="인증번호"
                        inputRef={ref}
                        editable={!isBusy}
                        value={value}
                        onChangeText={(text) => {
                          confirm.reset();
                          onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                        }}
                        onBlur={onBlur}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        placeholder="6자리 숫자"
                        errorMessage={timer.hasExpired ? '인증번호가 만료되었습니다.' : undefined}
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
      <FormMessage message={serverError?.message} isError size="double" />
      <View className="min-h-px flex-1" />
      {isVerified ? (
        <Button
          appearance="auth"
          title="다음"
          isLoading={signup.isPending}
          onPress={handleSignup}
        />
      ) : (
        hasSent && (
          <Button
            appearance="auth"
            title="인증 확인"
            disabled={code.length !== 6 || timer.hasExpired || isBusy}
            onPress={handleVerify}
          />
        )
      )}
    </AuthFlowLayout>
  );
}
