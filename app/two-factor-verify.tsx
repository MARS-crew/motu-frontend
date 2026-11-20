import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { MySettingsLayout } from '@/components/my/MySettingsLayout';
import { TextField } from '@/components/TextField';
import { formatEmailCodeTime, useEmailCodeTimer } from '@/hooks/useEmailCodeTimer';
import {
  secondFactorPhoneSchema,
  secondFactorSchema,
  type SecondFactorForm,
} from '@/schemas/secondFactorSchema';
import { useSecondFactorPreviewStore } from '@/stores/useSecondFactorPreviewStore';

const RESEND_SECONDS = 30;
const PREVIEW_VERIFICATION_CODE = '135790';

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return [digits.slice(0, 3), digits.slice(3, 7), digits.slice(7)].filter(Boolean).join('-');
}

export default function TwoFactorVerifyScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const [showRequiredToast, setShowRequiredToast] = useState(__DEV__ && preview === 'required');
  const [now, setNow] = useState(Date.now);
  const { register, recordFailure, lockedUntil } = useSecondFactorPreviewStore();
  const isLocked = lockedUntil !== null && lockedUntil > now;
  const timer = useEmailCodeTimer(RESEND_SECONDS);
  const {
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<SecondFactorForm>({
    resolver: zodResolver(secondFactorSchema),
    defaultValues: { phone: '', code: '' },
  });
  const [phone, code] = useWatch({ control, name: ['phone', 'code'] });

  useEffect(() => {
    if (!lockedUntil) return;
    const timeout = setTimeout(() => setNow(Date.now()), Math.max(0, lockedUntil - Date.now()));
    return () => clearTimeout(timeout);
  }, [lockedUntil]);

  useEffect(() => {
    if (!showRequiredToast) return;
    const timeout = setTimeout(() => setShowRequiredToast(false), 2500);
    return () => clearTimeout(timeout);
  }, [showRequiredToast]);

  const handleBack = () => router.dismissTo('/two-factor-security');
  const handleSend = () => {
    if (!__DEV__ || isLocked || (timer.resendRemaining > 0 && timer.hasSent)) return;
    const parsed = secondFactorPhoneSchema.safeParse(phone);
    if (!parsed.success) {
      setError('phone', { message: parsed.error.issues[0]?.message });
      return;
    }
    clearErrors();
    setValue('code', '');
    timer.start();
  };
  const handleVerify = handleSubmit(({ phone, code }) => {
    if (!__DEV__ || isLocked || !timer.isCurrent()) return;
    if (code !== PREVIEW_VERIFICATION_CODE) {
      recordFailure();
      setError('code', { message: '인증번호가 일치하지 않습니다.' });
      return;
    }
    register(`${phone.slice(0, 3)}-****-${phone.slice(-4)}`);
    handleBack();
  });

  const resendLabel =
    timer.resendRemaining > 0 && !isLocked
      ? `인증번호 재발송 (${formatEmailCodeTime(timer.resendRemaining)})`
      : '인증번호 재발송';

  return (
    <MySettingsLayout
      title="2차 보안"
      onBack={handleBack}
      footer={
        <View className="border-t border-motu-grey-lighter px-[24px] pb-[20px] pt-[17px]">
          <Button
            appearance="auth"
            title="인증 확인 및 등록"
            disabled={
              !__DEV__ || !timer.hasSent || timer.hasExpired || isLocked || code.length !== 6
            }
            onPress={handleVerify}
          />
        </View>
      }
      overlay={
        showRequiredToast && (
          <View
            pointerEvents="none"
            accessibilityLiveRegion="polite"
            className="absolute bottom-[106px] left-[24px] right-[24px] flex-row items-center gap-[8px] rounded-[12px] bg-motu-black px-[16px] py-[14px]"
          >
            <Image
              source={require('../assets/icons/my/security/info.svg')}
              className="h-[16px] w-[16px]"
              contentFit="contain"
              accessible={false}
            />
            <Text className="font-pretendard-bold text-[14px] leading-[20px] text-motu-on-cta text-no-font-padding">
              2차 보안 설정 후 이용해 주세요.
            </Text>
          </View>
        )
      }
    >
      <View className="gap-[16px] pt-[4px]">
        <Text className="font-pretendard text-[13px] leading-[20px] text-motu-grey text-no-font-padding">
          연락처와 같은 번호여도 SMS 인증이 필요합니다.
        </Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <TextField
              variant="auth"
              label="인증 휴대폰 번호"
              inputRef={ref}
              value={value}
              onChangeText={(text) => {
                onChange(formatPhoneInput(text));
                setValue('code', '');
                clearErrors();
                timer.reset();
              }}
              onBlur={onBlur}
              inputMode="tel"
              autoComplete="tel"
              placeholder="010-0000-0000"
              errorMessage={errors.phone?.message}
            />
          )}
        />
        <Button
          appearance="auth"
          title={timer.hasSent || isLocked ? resendLabel : '인증번호 보내기'}
          variant={timer.hasSent ? 'secondary' : 'primary'}
          disabled={!__DEV__ || isLocked || (timer.hasSent && timer.resendRemaining > 0)}
          onPress={handleSend}
        />
        {(timer.hasSent || isLocked) && (
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
                    clearErrors('code');
                    onChange(text.replace(/\D/g, '').slice(0, 6));
                  }}
                  onBlur={onBlur}
                  inputMode="numeric"
                  placeholder="6자리 숫자"
                  autoComplete="one-time-code"
                  editable={!isLocked}
                  errorMessage={isLocked ? undefined : errors.code?.message}
                />
              )}
            />
            <Text
              accessibilityLiveRegion={isLocked || timer.hasExpired ? 'polite' : 'none'}
              numberOfLines={2}
              className={`h-[40px] font-pretendard-medium text-[13px] leading-[20px] text-no-font-padding ${isLocked || timer.hasExpired ? 'text-motu-btn-red' : 'text-motu-text-tertiary'}`}
            >
              {isLocked
                ? '인증번호를 5회 연속 잘못 입력했습니다.\n30분 후 다시 시도해 주세요.'
                : timer.hasExpired
                  ? '인증번호가 만료되었습니다.'
                  : `남은 시간 ${formatEmailCodeTime(timer.remaining)}`}
            </Text>
          </>
        )}
      </View>
    </MySettingsLayout>
  );
}
