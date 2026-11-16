import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ProfileEditFooter } from '@/components/profileEdit/ProfileEditFooter';
import { ProfileEditVerifyMessage } from '@/components/profileEdit/ProfileEditVerifyMessage';
import { TextField } from '@/components/TextField';
import { TopBar } from '@/components/TopBar';
import { PROFILE_EDIT_PREVIEW } from '@/constants/profileEditPreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { profileEditVerifySchema, type ProfileEditVerifyForm } from '@/schemas/profileEditSchema';

type VerifyStatus = 'idle' | 'sent' | 'sendFailed' | 'verified';

// 미리보기 주소: /profile-edit?preview=sent | verified | mismatch | send-failed
function getInitialStatus(preview?: string): VerifyStatus {
  if (preview === 'sent' || preview === 'mismatch') return 'sent';
  if (preview === 'verified') return 'verified';
  if (preview === 'send-failed') return 'sendFailed';
  return 'idle';
}

function getInitialCode(preview?: string) {
  if (preview === 'mismatch') return '135791';
  if (preview === 'verified') return PROFILE_EDIT_PREVIEW.verificationCode;
  return '';
}

export default function ProfileEditVerifyScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [status, setStatus] = useState<VerifyStatus>(() => getInitialStatus(preview));
  const [hasCodeError, setHasCodeError] = useState(preview === 'mismatch');
  const { control, trigger, reset, getValues } = useForm<ProfileEditVerifyForm>({
    resolver: zodResolver(profileEditVerifySchema),
    defaultValues: { email: PROFILE_EDIT_PREVIEW.email, code: getInitialCode(preview) },
  });
  const code = useWatch({ control, name: 'code' });

  const hasRequestedSend = status !== 'idle';
  const hasSent = status === 'sent' || status === 'verified';
  const isVerified = status === 'verified';

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/my');
  };

  // 퍼블리싱 단계: 실제 발송·검증 없이 화면 상태만 바꿉니다.
  const handleSend = async () => {
    const isEmailValid = await trigger('email');
    if (!isEmailValid) return;
    setStatus('sent');
    setHasCodeError(false);
    reset({ ...getValues(), code: '' });
  };

  const handleConfirm = () => {
    if (code === PROFILE_EDIT_PREVIEW.verificationCode) setStatus('verified');
    else setHasCodeError(true);
  };

  const handleNext = () => router.push('/profile-edit/form');

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="회원정보 수정" onBack={handleBack} />
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
            이메일을 인증하고 프로필을 편집하세요.
          </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { ref, value, onBlur, onChange }, fieldState: { error } }) => (
              <TextField
                variant="auth"
                label="이메일(필수 입력)"
                inputRef={ref}
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="example@email.com"
                errorMessage={error?.message}
              />
            )}
          />

          <Button
            appearance="auth"
            variant={hasRequestedSend ? 'secondary' : 'primary'}
            title={hasRequestedSend ? '인증번호 재발송' : '인증번호 발송'}
            onPress={handleSend}
          />

          {status === 'sendFailed' && (
            <ProfileEditVerifyMessage
              tone="error"
              message="인증번호 발송에 실패했습니다. 다시 시도해 주세요."
            />
          )}
          {status === 'sent' && (
            <ProfileEditVerifyMessage
              tone="success"
              message="인증번호가 발송되었습니다. 이메일을 확인해 주세요."
            />
          )}

          {hasSent && (
            <>
              <Controller
                control={control}
                name="code"
                render={({ field: { ref, value, onBlur, onChange } }) => (
                  <TextField
                    variant="auth"
                    label="인증하기"
                    inputRef={ref}
                    value={value}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      setHasCodeError(false);
                      onChange(text.replace(/[^0-9]/g, '').slice(0, 6));
                    }}
                    editable={!isVerified}
                    isInvalid={hasCodeError}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="인증번호를 입력하세요."
                  />
                )}
              />
              {isVerified && (
                <ProfileEditVerifyMessage tone="success" message="인증이 완료되었습니다." />
              )}
              {hasCodeError && (
                <ProfileEditVerifyMessage
                  tone="error"
                  message="인증번호가 일치하지 않습니다. 다시 확인해 주세요."
                />
              )}
              <Button
                appearance="auth"
                title="확인"
                disabled={isVerified || code.length !== 6}
                onPress={handleConfirm}
              />
            </>
          )}
        </ScrollView>
        <ProfileEditFooter title="회원정보 수정하기" disabled={!isVerified} onPress={handleNext} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
