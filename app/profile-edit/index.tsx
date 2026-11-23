import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { ProfileEditFooter } from '@/components/profileEdit/ProfileEditFooter';
import { ProfileEditVerifyMessage } from '@/components/profileEdit/ProfileEditVerifyMessage';
import { TextField } from '@/components/TextField';
import { TopBar } from '@/components/TopBar';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useVerificationTimer } from '@/hooks/useVerificationTimer';
import { useMyInfoQuery } from '@/queries/useMyInfoQuery';
import {
  useConfirmProfileEditEmailMutation,
  useSendProfileEditEmailMutation,
} from '@/queries/useProfileEditMutation';
import { profileEditVerifySchema, type ProfileEditVerifyForm } from '@/schemas/profileEditSchema';
import { getProfileEditErrorMessage } from '@/utils/profileEditError';

type Delivery = { email: string; expiresAt: string; resendAvailableAt: string };

export default function ProfileEditVerifyScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { data: myInfo } = useMyInfoQuery();
  const send = useSendProfileEditEmailMutation();
  const confirm = useConfirmProfileEditEmailMutation();
  const isBusyRef = useRef(false);
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  // 발송을 한 번이라도 요청했는지입니다. 첫 발송이 실패해도 디자인대로 버튼을 '재발송'으로 바꿉니다.
  const [hasRequestedSend, setHasRequestedSend] = useState(false);
  const timer = useVerificationTimer(delivery ?? undefined);
  const {
    control,
    trigger,
    getValues,
    resetField,
    formState: { errors },
  } = useForm<ProfileEditVerifyForm>({
    resolver: zodResolver(profileEditVerifySchema),
    // 디자인대로 회원 이메일을 채워 두고, 내 정보를 다시 불러와도 사용자가 고친 값은 유지합니다.
    values: { email: myInfo?.email ?? '', code: '' },
    resetOptions: { keepDirtyValues: true },
  });
  const code = useWatch({ control, name: 'code' });

  const isVerified = confirm.data?.verified === true;
  const isBusy = send.isPending || confirm.isPending;
  const hasExpired = timer.hasExpired && !isVerified;
  const sendMessage =
    errors.email?.message ??
    getProfileEditErrorMessage(send.error, '인증번호 발송에 실패했습니다. 다시 시도해 주세요.');
  const codeMessage = hasExpired
    ? '인증번호가 만료되었습니다. 인증번호를 다시 받아 주세요.'
    : getProfileEditErrorMessage(confirm.error);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/my');
  };

  const handleSend = async () => {
    if (isBusyRef.current || !(await trigger('email'))) return;
    isBusyRef.current = true;
    setHasRequestedSend(true);
    const email = getValues('email');
    confirm.reset();
    try {
      const result = await send.mutateAsync(email);
      setDelivery({ email, ...result });
      resetField('code');
    } catch {
      /* 서버에서 받은 오류를 발송 문구 자리에 보여 줍니다. */
    } finally {
      isBusyRef.current = false;
    }
  };

  const handleConfirm = async () => {
    if (isBusyRef.current || !delivery || hasExpired) return;
    isBusyRef.current = true;
    try {
      await confirm.mutateAsync({ email: delivery.email, code });
    } catch {
      /* 서버에서 받은 오류를 인증 결과 문구 자리에 보여 줍니다. */
    } finally {
      isBusyRef.current = false;
    }
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
            render={({ field: { ref, value, onBlur, onChange } }) => (
              <TextField
                variant="auth"
                label="이메일(필수 입력)"
                hasMessageSpace={false}
                inputRef={ref}
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => {
                  send.reset();
                  onChange(text);
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="example@email.com"
              />
            )}
          />

          <Button
            appearance="auth"
            variant={hasRequestedSend ? 'secondary' : 'primary'}
            title={hasRequestedSend ? '인증번호 재발송' : '인증번호 발송'}
            disabled={isBusy}
            onPress={handleSend}
          />

          {/* 문구가 없어도 자리를 남겨 아래 입력칸이 움직이지 않게 합니다. */}
          <View className="h-[20px]">
            {sendMessage ? (
              <ProfileEditVerifyMessage tone="error" message={sendMessage} />
            ) : (
              delivery &&
              !isVerified && (
                <ProfileEditVerifyMessage
                  tone="success"
                  message="인증번호가 발송되었습니다. 이메일을 확인해 주세요."
                />
              )
            )}
          </View>

          {delivery && (
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
                      editable={!isVerified}
                      isInvalid={Boolean(codeMessage)}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="인증번호를 입력하세요."
                    />
                  )}
                />
                {/* 인증 결과 문구 자리를 미리 남겨 확인 버튼 위치를 고정합니다. */}
                <View className="h-[20px]">
                  {isVerified ? (
                    <ProfileEditVerifyMessage tone="success" message="인증이 완료되었습니다." />
                  ) : (
                    codeMessage && <ProfileEditVerifyMessage tone="error" message={codeMessage} />
                  )}
                </View>
              </View>
              <Button
                appearance="auth"
                title="확인"
                disabled={isVerified || isBusy || hasExpired || code.length !== 6}
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
