import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { RecoveryStatusIcon } from '@/components/recovery/RecoveryStatusIcon';
import { TextField } from '@/components/TextField';
import { useRequestPasswordResetMutation } from '@/queries/usePasswordResetMutation';
import { getAuthError } from '@/utils/authError';
import {
  requestPasswordResetSchema,
  type RequestPasswordResetForm,
} from '@/schemas/accountRecoverySchema';

export default function ResetPasswordScreen() {
  const request = useRequestPasswordResetMutation();
  const isSubmittingRef = useRef(false);
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { isValid, errors },
  } = useForm<RequestPasswordResetForm>({
    resolver: zodResolver(requestPasswordResetSchema),
    mode: 'onChange',
    defaultValues: { loginId: '', email: '' },
  });

  const handleRequest = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      await handleSubmit(async (form) => {
        await request.mutateAsync(form);
      })();
    } catch (error) {
      const message = getAuthError(error)?.message;
      if (message) setError('email', { type: 'server', message });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleLogin = () => router.dismissTo('/login');
  const handleBack = () => (router.canGoBack() ? router.back() : handleLogin());

  if (request.isSuccess) {
    return (
      <AuthFlowLayout title="비밀번호 재설정" isSummary>
        <RecoveryStatusIcon icon="mail" />
        <AuthFlowHeading
          title="메일을 확인해 주세요"
          description="입력하신 정보가 일치하면 가입 이메일로 재설정 링크를 보내드립니다. 링크는 발급 후 10분간 유효하며, 한 번만 사용할 수 있습니다."
        />
        <View className="flex-1" />
        <Button appearance="auth" title="로그인으로 돌아가기" onPress={handleLogin} />
      </AuthFlowLayout>
    );
  }

  return (
    <AuthFlowLayout title="비밀번호 재설정" onBack={handleBack}>
      <AuthFlowHeading
        title="비밀번호를 재설정합니다."
        description="입력한 정보가 확인되면 이메일로 일회용 링크를 보냅니다."
      />
      <View className="gap-[16px]">
        <Controller
          control={control}
          name="loginId"
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <TextField
              variant="auth"
              label="아이디"
              inputRef={ref}
              value={value}
              onChangeText={(text) => {
                clearErrors();
                request.reset();
                onChange(text);
              }}
              editable={!request.isPending}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              errorMessage={errors.loginId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <TextField
              variant="auth"
              label="가입 이메일"
              inputRef={ref}
              value={value}
              onChangeText={(text) => {
                clearErrors();
                request.reset();
                onChange(text);
              }}
              editable={!request.isPending}
              onBlur={onBlur}
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="name@example.com"
              errorMessage={errors.email?.message}
              hasDesignMessagesOnly={errors.email?.type !== 'server'}
            />
          )}
        />
        <Button
          appearance="auth"
          title="재설정 링크 보내기"
          disabled={!isValid || request.isPending}
          onPress={handleRequest}
        />
      </View>
    </AuthFlowLayout>
  );
}
