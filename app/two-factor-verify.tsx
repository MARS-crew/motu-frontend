import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { MySettingsLayout } from '@/components/my/MySettingsLayout';
import { TextField } from '@/components/TextField';
import { FormMessage } from '@/components/FormMessage';
import { formatEmailCodeTime } from '@/hooks/useEmailCodeTimer';
import { getVerificationTime, useVerificationTimer } from '@/hooks/useVerificationTimer';
import {
  secondFactorSchema,
  secondFactorPhoneSchema,
  type SecondFactorForm,
} from '@/schemas/secondFactorSchema';
import {
  useTwoFactorRegistrationDeliveryQuery,
  useSendTwoFactorRegistrationMutation,
  useConfirmTwoFactorRegistrationMutation,
} from '@/queries/useTwoFactorRegistrationMutation';
import { useTwoFactorGate } from '@/hooks/useTwoFactorGate';
import { getTwoFactorReturnRoute, parseTwoFactorIntent } from '@/utils/twoFactorSession';
import { getAuthError } from '@/utils/authError';
import { formatPhoneInput } from '@/utils/formatPhone';

export default function TwoFactorVerifyScreen() {
  const { intent: rawIntent } = useLocalSearchParams<{ intent?: string }>();
  const intent = parseTwoFactorIntent(rawIntent);
  const { requireVerification } = useTwoFactorGate();
  const delivery = useTwoFactorRegistrationDeliveryQuery();
  const send = useSendTwoFactorRegistrationMutation();
  const confirm = useConfirmTwoFactorRegistrationMutation();
  const requestLock = useRef(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  // 이미 등록한 번호의 변경은 기존 번호로 재인증한 세션이 있어야 가능합니다.
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      void requireVerification(
        { kind: 'phone-change', returnIntent: rawIntent },
        undefined,
        false,
        true,
      )
        .then((allowed) => {
          if (isActive) setIsAuthorized(allowed);
        })
        .catch(() => {
          if (isActive) setIsAuthorized(false);
        });
      return () => {
        isActive = false;
      };
    }, [rawIntent, requireVerification]),
  );
  const { control, setValue, setError, clearErrors, handleSubmit } = useForm<SecondFactorForm>({
    resolver: zodResolver(secondFactorSchema),
    defaultValues: { phone: '', code: '' },
  });
  const [phone, code] = useWatch({ control, name: ['phone', 'code'] });
  const currentDelivery = delivery.data?.phoneNumber === phone ? delivery.data : undefined;
  const timer = useVerificationTimer(currentDelivery);
  const isBusy = send.isPending || confirm.isPending;
  const error = getAuthError(confirm.error ?? send.error);
  const isLocked = error?.code === 'TWO_FACTOR_LOCKED';
  const handleBack = () =>
    router.canGoBack() ? router.back() : router.replace('/two-factor-security');
  const handleSend = async () => {
    if (
      requestLock.current ||
      !isAuthorized ||
      isLocked ||
      getVerificationTime(currentDelivery).resendRemaining > 0
    )
      return;
    const parsed = secondFactorPhoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError('phone', { message: parsed.error.issues[0]?.message });
      return;
    }
    requestLock.current = true;
    clearErrors();
    confirm.reset();
    try {
      await send.mutateAsync(parsed.data);
      setValue('code', '');
    } catch (error) {
      if (getAuthError(error)?.code === 'TWO_FACTOR_REQUIRED') {
        try {
          await requireVerification(
            { kind: 'phone-change', returnIntent: rawIntent },
            undefined,
            true,
          );
        } catch {
          /* 조회 실패 시 등록을 진행하지 않습니다. */
        }
      }
    } finally {
      requestLock.current = false;
    }
  };
  const handleVerify = () => {
    void handleSubmit(async (body) => {
      if (
        requestLock.current ||
        !isAuthorized ||
        !currentDelivery ||
        getVerificationTime(currentDelivery).hasExpired
      )
        return;
      requestLock.current = true;
      try {
        await confirm.mutateAsync(body);
        router.dismissTo(intent ? getTwoFactorReturnRoute(intent, false) : '/two-factor-security');
      } catch {
        /* 서버가 제공한 오류만 표시합니다. */
      } finally {
        requestLock.current = false;
      }
    })();
  };
  return (
    <MySettingsLayout
      title="2차 보안"
      onBack={handleBack}
      footer={
        <View className="border-t border-motu-grey-lighter bg-motu-surface-card px-[24px] pb-[24px] pt-[17px]">
          <Button
            appearance="auth"
            title="인증 확인 및 등록"
            disabled={
              !isAuthorized ||
              isBusy ||
              !currentDelivery ||
              timer.hasExpired ||
              isLocked ||
              code.length !== 6
            }
            onPress={handleVerify}
          />
        </View>
      }
    >
      <View className="gap-[16px] rounded-[16px] border border-motu-grey-lighter bg-motu-surface-card p-[20px]">
        <Text className="font-pretendard text-[12.5px] leading-[20.313px] text-motu-grey text-no-font-padding">
          연락처와 같은 번호여도 SMS 인증이 필요합니다.
        </Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur, ref }, fieldState: { error } }) => (
            <TextField
              variant="auth"
              label="인증 휴대폰 번호"
              inputRef={ref}
              value={value}
              onChangeText={(text) => {
                onChange(formatPhoneInput(text));
                setValue('code', '');
                clearErrors();
                send.reset();
                confirm.reset();
              }}
              onBlur={onBlur}
              editable={!isBusy}
              maxLength={13}
              inputMode="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
              errorMessage={error?.message}
            />
          )}
        />
        <Button
          appearance="auth"
          title={
            !currentDelivery
              ? '인증번호 보내기'
              : timer.resendRemaining > 0
                ? `인증번호 재발송 (${formatEmailCodeTime(timer.resendRemaining)})`
                : '인증번호 재발송'
          }
          disabled={!isAuthorized || isBusy || isLocked || timer.resendRemaining > 0}
          onPress={() => void handleSend()}
        />
        {currentDelivery && (
          <>
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
                    confirm.reset();
                    onChange(text.replace(/\D/g, '').slice(0, 6));
                  }}
                  onBlur={onBlur}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="6자리 숫자"
                  maxLength={6}
                  editable={!isBusy && !isLocked}
                  errorMessage={timer.hasExpired ? '인증번호가 만료되었습니다.' : undefined}
                />
              )}
            />
            <Text className="font-pretendard-medium text-[12px] leading-[20px] text-motu-text-tertiary text-no-font-padding">
              남은 시간 {formatEmailCodeTime(timer.remaining)}
            </Text>
          </>
        )}
        <FormMessage message={error?.message} isError size="double" hasDesignMessagesOnly={false} />
      </View>
    </MySettingsLayout>
  );
}
