import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ProfileEditFooter } from '@/components/profileEdit/ProfileEditFooter';
import { ProfileEditVerifyMessage } from '@/components/profileEdit/ProfileEditVerifyMessage';
import { TextField } from '@/components/TextField';
import { TopBar } from '@/components/TopBar';
import { PROFILE_EDIT_PREVIEW } from '@/constants/profileEditPreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { phoneChangeSchema, type PhoneChangeForm } from '@/schemas/profileEditSchema';

type VerifyStatus = 'idle' | 'sent' | 'sendFailed' | 'verified';

// 미리보기 주소: /profile-edit/phone?preview=sent | verified | mismatch | send-failed
function getInitialStatus(preview?: string): VerifyStatus {
  if (preview === 'sent' || preview === 'mismatch') return 'sent';
  if (preview === 'verified') return 'verified';
  if (preview === 'send-failed') return 'sendFailed';
  return 'idle';
}

function getInitialCode(preview?: string) {
  if (preview === 'mismatch') return '135791';
  if (preview === 'sent') return PROFILE_EDIT_PREVIEW.verificationCode;
  return '';
}

// 숫자만 입력해도 010-0000-0000 형태로 하이픈을 넣어 줍니다.
function formatPhoneNumber(text: string) {
  const digits = text.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function PhoneChangeScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [status, setStatus] = useState<VerifyStatus>(() => getInitialStatus(preview));
  const [hasCodeError, setHasCodeError] = useState(preview === 'mismatch');
  const {
    control,
    trigger,
    reset,
    getValues,
    formState: { errors },
  } = useForm<PhoneChangeForm>({
    resolver: zodResolver(phoneChangeSchema),
    defaultValues: {
      phoneNumber: preview ? PROFILE_EDIT_PREVIEW.newPhoneNumber : PROFILE_EDIT_PREVIEW.phoneNumber,
      code: getInitialCode(preview),
    },
  });
  const phoneNumberError = errors.phoneNumber?.message;
  const code = useWatch({ control, name: 'code' });

  const hasRequestedSend = status !== 'idle';
  const isVerified = status === 'verified';

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile-edit/form');
  };

  // 퍼블리싱 단계: 실제 문자 발송·검증 없이 화면 상태만 바꿉니다.
  const handleSend = async () => {
    const isPhoneNumberValid = await trigger('phoneNumber');
    if (!isPhoneNumberValid) return;
    setStatus('sent');
    setHasCodeError(false);
    reset({ ...getValues(), code: '' });
  };

  const handleConfirm = () => {
    if (code === PROFILE_EDIT_PREVIEW.verificationCode) setStatus('verified');
    else setHasCodeError(true);
  };

  // TODO: 연락처 변경 API 연결 후 수정 폼에 새 번호를 반영합니다.
  const handleChange = () => router.back();

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
                onChangeText={(text) => onChange(formatPhoneNumber(text))}
                editable={!isVerified}
                keyboardType="phone-pad"
                autoComplete="tel"
                maxLength={13}
                placeholder="010-1234-5678"
                isInvalid={Boolean(phoneNumberError)}
              />
            )}
          />

          <Button
            appearance="auth"
            variant={hasRequestedSend ? 'secondary' : 'primary'}
            title={hasRequestedSend ? '인증번호 재발송' : '인증번호 발송'}
            disabled={isVerified}
            onPress={handleSend}
          />

          <View className="h-[20px]">
            {phoneNumberError && (
              <ProfileEditVerifyMessage tone="error" message={phoneNumberError} />
            )}
            {!phoneNumberError && status === 'sendFailed' && (
              <ProfileEditVerifyMessage
                tone="error"
                message="인증번호 발송에 실패했습니다. 다시 시도해 주세요."
              />
            )}
            {!phoneNumberError && status === 'sent' && (
              <ProfileEditVerifyMessage
                tone="success"
                message="인증번호가 발송되었습니다. 메시지를 확인해 주세요."
              />
            )}
            {isVerified && (
              <ProfileEditVerifyMessage tone="success" message="인증이 완료되었습니다." />
            )}
          </View>

          {status === 'sent' && (
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
                        setHasCodeError(false);
                        onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                      }}
                      isInvalid={hasCodeError}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="인증번호를 입력하세요."
                    />
                  )}
                />
                {/* 인증 결과 문구 자리를 미리 남겨 확인 버튼 위치를 고정합니다. */}
                <View className="h-[20px]">
                  {hasCodeError && (
                    <ProfileEditVerifyMessage
                      tone="error"
                      message="인증번호가 일치하지 않습니다. 다시 확인해 주세요."
                    />
                  )}
                </View>
              </View>
              <Button
                appearance="auth"
                title="확인"
                disabled={code.length !== 6}
                onPress={handleConfirm}
              />
            </>
          )}
        </ScrollView>
        <ProfileEditFooter title="연락처 변경하기" disabled={!isVerified} onPress={handleChange} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
