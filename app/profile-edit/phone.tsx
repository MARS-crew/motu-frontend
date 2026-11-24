import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ProfileEditFooter } from '@/components/profileEdit/ProfileEditFooter';
import { ProfileEditVerifyMessage } from '@/components/profileEdit/ProfileEditVerifyMessage';
import { TextField } from '@/components/TextField';
import { Toast } from '@/components/Toast';
import { TopBar } from '@/components/TopBar';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useVerificationTimer } from '@/hooks/useVerificationTimer';
import { useMyInfoQuery } from '@/queries/useMyInfoQuery';
import {
  useConfirmPhoneChangeMutation,
  useSendPhoneChangeMutation,
  useUpdateMyPhoneNumberMutation,
} from '@/queries/useProfileEditMutation';
import { phoneChangeSchema, type PhoneChangeForm } from '@/schemas/profileEditSchema';
import { getAuthError } from '@/utils/authError';
import { formatPhoneNumber } from '@/utils/phoneNumber';
import { getProfileEditErrorMessage } from '@/utils/profileEditError';

type Delivery = { phoneNumber: string; expiresAt: string; resendAvailableAt: string };

// 숫자만 입력해도 010-0000-0000 형태로 하이픈을 넣어 줍니다.
function formatPhoneInput(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

const isTwoFactorRequired = (error: unknown) =>
  getAuthError(error)?.code === 'USER_CONTACT_TWO_FACTOR_REQUIRED';

export default function PhoneChangeScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { data: myInfo } = useMyInfoQuery();
  const send = useSendPhoneChangeMutation();
  const confirm = useConfirmPhoneChangeMutation();
  const updatePhoneNumber = useUpdateMyPhoneNumberMutation();
  const isBusyRef = useRef(false);
  // 마지막으로 발송에 성공한 번호와 만료 시각입니다. 재발송이 실패해도 인증번호 칸은 유지합니다.
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  // 발송을 한 번이라도 요청했는지입니다. 첫 발송이 실패해도 디자인대로 버튼을 '재발송'으로 바꿉니다.
  const [hasRequestedSend, setHasRequestedSend] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timer = useVerificationTimer(delivery ?? undefined);
  const {
    control,
    trigger,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<PhoneChangeForm>({
    resolver: zodResolver(phoneChangeSchema),
    // 디자인대로 지금 연락처를 채워 두고, 내 정보를 다시 불러와도 사용자가 고친 값은 유지합니다.
    values: {
      phoneNumber: myInfo?.phoneNumber ? formatPhoneNumber(myInfo.phoneNumber) : '',
      code: '',
    },
    resetOptions: { keepDirtyValues: true },
  });
  const code = useWatch({ control, name: 'code' });

  const isVerified = confirm.data?.verified === true;
  const isBusy = send.isPending || confirm.isPending || updatePhoneNumber.isPending;
  const hasExpired = timer.hasExpired && !isVerified;
  const sendMessage =
    errors.phoneNumber?.message ??
    getProfileEditErrorMessage(send.error, '인증번호 발송에 실패했습니다. 다시 시도해 주세요.');
  const codeMessage = hasExpired
    ? '인증번호가 만료되었습니다. 인증번호를 다시 받아 주세요.'
    : getProfileEditErrorMessage(confirm.error);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile-edit/form');
  };
  const handleToastHide = useCallback(() => setToastMessage(null), []);
  // 2차 보안을 설정한 회원만 연락처를 바꿀 수 있어, 디자인대로 2차 보안 설정 화면으로 보냅니다.
  const goToTwoFactorSetup = () =>
    router.replace({ pathname: '/two-factor-verify', params: { preview: 'required' } });

  const handleSend = async () => {
    if (isBusyRef.current || !(await trigger('phoneNumber'))) return;
    isBusyRef.current = true;
    setHasRequestedSend(true);
    const phoneNumber = getValues('phoneNumber');
    confirm.reset();
    try {
      const result = await send.mutateAsync(phoneNumber);
      setDelivery({ phoneNumber, ...result });
      resetField('code');
    } catch (error) {
      if (isTwoFactorRequired(error)) goToTwoFactorSetup();
    } finally {
      isBusyRef.current = false;
    }
  };

  const handleConfirm = async () => {
    if (isBusyRef.current || !delivery || hasExpired) return;
    isBusyRef.current = true;
    try {
      await confirm.mutateAsync({ phoneNumber: delivery.phoneNumber, code });
    } catch (error) {
      if (isTwoFactorRequired(error)) goToTwoFactorSetup();
    } finally {
      isBusyRef.current = false;
    }
  };

  const handleChange = async () => {
    if (isBusyRef.current || !delivery) return;
    isBusyRef.current = true;
    try {
      await updatePhoneNumber.mutateAsync(delivery.phoneNumber);
      router.back();
    } catch (error) {
      if (isTwoFactorRequired(error)) goToTwoFactorSetup();
      else setToastMessage(getProfileEditErrorMessage(error));
    } finally {
      isBusyRef.current = false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="연락처 변경" onBack={handleBack} />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
          contentContainerClassName="gap-[16px] px-[24px] pb-[24px] pt-[8px]"
          showsVerticalScrollIndicator={false}
        >
          <Text className="font-pretendard text-[12.5px] leading-[20.3px] text-motu-grey">
            연락처를 변경하려면 인증하세요.
          </Text>

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { ref, value, onBlur, onChange } }) => (
              <TextField
                variant="auth"
                label="변경할 연락처"
                hasMessageSpace={false}
                inputRef={ref}
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  send.reset();
                  onChange(formatPhoneInput(text));
                }}
                editable={!isVerified}
                keyboardType="phone-pad"
                autoComplete="tel"
                maxLength={13}
                placeholder="010-0000-0000"
              />
            )}
          />

          <Button
            appearance="auth"
            variant={hasRequestedSend ? 'secondary' : 'primary'}
            title={hasRequestedSend ? '인증번호 재발송' : '인증번호 발송'}
            disabled={isVerified || isBusy}
            onPress={handleSend}
          />

          {/* 문구가 없어도 자리를 남겨 아래 입력칸이 움직이지 않게 합니다. */}
          <View className="h-[20px]">
            {sendMessage ? (
              <ProfileEditVerifyMessage tone="error" message={sendMessage} />
            ) : isVerified ? (
              <ProfileEditVerifyMessage tone="success" message="인증이 완료되었습니다." />
            ) : (
              delivery && (
                <ProfileEditVerifyMessage
                  tone="success"
                  message="인증번호가 발송되었습니다. 메시지를 확인해 주세요."
                />
              )
            )}
          </View>

          {delivery && !isVerified && (
            <>
              <View className="gap-[8px]">
                <Controller
                  control={control}
                  name="code"
                  render={({ field: { ref, value, onBlur, onChange } }) => (
                    <TextField
                      variant="auth"
                      label="인증하기"
                      hasMessageSpace={false}
                      inputRef={ref}
                      value={value}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        confirm.reset();
                        onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                      }}
                      isInvalid={Boolean(codeMessage)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="인증번호를 입력하세요."
                    />
                  )}
                />
                {/* 인증 결과 문구 자리를 미리 남겨 확인 버튼 위치를 고정합니다. */}
                <View className="h-[20px]">
                  {codeMessage && <ProfileEditVerifyMessage tone="error" message={codeMessage} />}
                </View>
              </View>
              <Button
                appearance="auth"
                title="확인"
                disabled={isBusy || hasExpired || code.length !== 6}
                onPress={handleConfirm}
              />
            </>
          )}
        </ScrollView>
        <ProfileEditFooter
          title="연락처 변경하기"
          disabled={!isVerified || isBusy}
          onPress={handleChange}
        />
      </KeyboardAvoidingView>
      <View pointerEvents="none" className="absolute inset-x-0 bottom-[104px]">
        <Toast message={toastMessage} onHide={handleToastHide} />
      </View>
    </SafeAreaView>
  );
}
