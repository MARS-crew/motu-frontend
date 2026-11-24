import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowBadge, AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime } from '@/hooks/useEmailCodeTimer';
import { getVerificationTime, useVerificationTimer } from '@/hooks/useVerificationTimer';
import {
  useFindIdDeliveryQuery,
  useSendFindIdCodeMutation,
  useFindLoginIdMutation,
} from '@/queries/useFindIdMutation';
import { getAuthError } from '@/utils/authError';
import { findIdSchema, type FindIdForm } from '@/schemas/accountRecoverySchema';

export default function FindIdScreen() {
  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    trigger,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<FindIdForm>({
    resolver: zodResolver(findIdSchema),
    defaultValues: { email: '', code: '' },
  });
  const [email, code] = useWatch({ control, name: ['email', 'code'] });
  const delivery = useFindIdDeliveryQuery(email);
  const send = useSendFindIdCodeMutation();
  const find = useFindLoginIdMutation();
  const timer = useVerificationTimer(delivery.data ?? undefined);
  const isSubmittingRef = useRef(false);
  const isPending = send.isPending || find.isPending;
  const hasNoMatch = getAuthError(send.error)?.code === 'AUTH_EMAIL_NOT_REGISTERED';
  const hasSent = Boolean(delivery.data) && !hasNoMatch;

  const handleLogin = () => router.dismissTo('/login');
  const handleBack = () => (router.canGoBack() ? router.back() : handleLogin());
  const handleEmailChange = (value: string) => {
    delivery.clear();
    send.reset();
    find.reset();
    setValue('email', value);
    setValue('code', '');
    clearErrors();
  };
  const handleSend = async () => {
    if (
      isSubmittingRef.current ||
      getVerificationTime(delivery.data ?? undefined).resendRemaining > 0
    )
      return;
    isSubmittingRef.current = true;
    try {
      if (!(await trigger('email'))) return;
      clearErrors();
      find.reset();
      await send.mutateAsync({ email: getValues('email') });
      setValue('code', '');
    } catch (error) {
      const serverError = getAuthError(error);
      if (serverError?.code === 'AUTH_EMAIL_NOT_REGISTERED') {
        delivery.clear();
      } else if (serverError?.message) {
        setError('email', { message: serverError.message });
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };
  const handleVerify = async () => {
    if (
      isSubmittingRef.current ||
      !hasSent ||
      getVerificationTime(delivery.data ?? undefined).hasExpired
    )
      return;
    isSubmittingRef.current = true;
    try {
      clearErrors('code');
      await handleSubmit(async (form) => {
        await find.mutateAsync(form);
        delivery.clear();
      })();
    } catch (error) {
      const message = getAuthError(error)?.message;
      if (message) setError('code', { message });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (find.data) {
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
            {find.data.maskedLoginId}
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
              editable={!isPending}
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
            !hasSent
              ? '인증번호 보내기'
              : timer.resendRemaining > 0
                ? `인증번호 재발송 (${formatEmailCodeTime(timer.resendRemaining)})`
                : '인증번호 재발송'
          }
          disabled={isPending || timer.resendRemaining > 0}
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
              render={({ field: { value, onChange, onBlur, ref } }) => (
                <TextField
                  variant="auth"
                  label="인증번호"
                  inputRef={ref}
                  value={value}
                  editable={!isPending}
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
              disabled={isPending || code.length !== 6 || timer.hasExpired}
              onPress={handleVerify}
            />
          </>
        )}
      </View>
      {hasNoMatch && (
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
