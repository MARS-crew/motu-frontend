import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowBadge, AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { RecoveryStatusIcon } from '@/components/recovery/RecoveryStatusIcon';
import { TextField } from '@/components/TextField';
import { resetPasswordSchema, type ResetPasswordForm } from '@/schemas/accountRecoverySchema';
import { passwordResetTokenSchema } from '@/schemas/passwordResetSchema';
import {
  useVerifyPasswordResetMutation,
  useConfirmPasswordResetMutation,
} from '@/queries/usePasswordResetMutation';
import { getAuthError } from '@/utils/authError';

const PASSWORD_FIELDS = [
  ['password', '새 비밀번호'],
  ['confirmPassword', '새 비밀번호 확인'],
] as const;

type PasswordResetFormProps = { token: string };

export function PasswordResetForm({ token }: PasswordResetFormProps) {
  const {
    mutate: verify,
    mutateAsync: verifyAsync,
    ...verification
  } = useVerifyPasswordResetMutation();
  const confirmation = useConfirmPasswordResetMutation();
  const isSubmittingRef = useRef(false);
  const hasToken = passwordResetTokenSchema.safeParse({ token }).success;
  useEffect(() => {
    if (hasToken) verify({ token });
  }, [hasToken, token, verify]);
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { isValid, errors, touchedFields },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  });
  const [password, passwordConfirmation] = useWatch({
    control,
    name: ['password', 'confirmPassword'],
  });
  const hasMismatch =
    touchedFields.confirmPassword &&
    passwordConfirmation !== '' &&
    password !== passwordConfirmation;

  const verificationError = getAuthError(verification.error);
  const confirmationError = getAuthError(confirmation.error);
  const isExpired =
    !hasToken ||
    verification.data?.valid === false ||
    verificationError?.code === 'AUTH_INVALID_PASSWORD_RESET_TOKEN' ||
    confirmationError?.code === 'AUTH_INVALID_PASSWORD_RESET_TOKEN';
  const isBusy = verification.isPending || confirmation.isPending;
  const canSubmit =
    isValid &&
    !isBusy &&
    hasToken &&
    !isExpired &&
    (verification.data?.valid === true || verification.isError);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/reset-password');
  };
  const handleLogin = () => router.dismissTo('/login');
  const handleComplete = async () => {
    if (isSubmittingRef.current || isExpired || isBusy) return;
    isSubmittingRef.current = true;
    try {
      await handleSubmit(async ({ password }) => {
        // 통신 실패 후 재시도할 때도 링크 검증을 통과한 경우에만 변경합니다.
        if (verification.data?.valid !== true) {
          const result = await verifyAsync({ token });
          if (!result.valid) return;
        }
        await confirmation.mutateAsync({ token, newPassword: password });
        reset();
      })();
    } catch (error) {
      const serverError = getAuthError(error);
      if (serverError?.code !== 'AUTH_INVALID_PASSWORD_RESET_TOKEN' && serverError?.message) {
        setError('password', { type: 'server', message: serverError.message });
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (isExpired) {
    return (
      <AuthFlowLayout title="비밀번호 재설정" isSummary>
        <RecoveryStatusIcon icon="clock" />
        <AuthFlowHeading
          title={'재설정 링크를\n사용할 수 없습니다'}
          description={'링크가 만료되었거나 이미 사용되었습니다.\n다시 요청해 주세요.'}
        />
        <View className="flex-1" />
        <Button
          appearance="auth"
          title="재설정 다시 요청"
          onPress={() => router.replace('/reset-password')}
        />
      </AuthFlowLayout>
    );
  }

  if (confirmation.isSuccess) {
    return (
      <AuthFlowLayout title="비밀번호 재설정" isSummary>
        <AuthFlowBadge>변경 완료</AuthFlowBadge>
        <AuthFlowHeading
          title="비밀번호가 변경되었습니다."
          description="기존 로그인 세션은 종료되었습니다."
        />
        <View className="flex-1" />
        <Button appearance="auth" title="로그인" onPress={handleLogin} />
      </AuthFlowLayout>
    );
  }

  return (
    <AuthFlowLayout title="새 비밀번호 설정" onBack={handleBack}>
      <AuthFlowHeading
        title="새 비밀번호를 입력해 주세요."
        description="8~20자, 영문·숫자·특수문자를 각각 1자 이상 포함해야 합니다."
      />
      <View className="gap-[16px]">
        {PASSWORD_FIELDS.map(([name, label]) => (
          <Controller
            key={name}
            control={control}
            name={name}
            rules={{ deps: name === 'password' ? ['confirmPassword'] : undefined }}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <TextField
                variant="auth"
                label={label}
                inputRef={ref}
                value={value}
                onChangeText={(text) => {
                  clearErrors(name);
                  confirmation.reset();
                  onChange(text);
                }}
                editable={!isBusy}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!visible[name]}
                messageSize={name === 'confirmPassword' ? 'double' : 'single'}
                errorMessage={
                  name === 'confirmPassword' && hasMismatch
                    ? '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.'
                    : errors[name]?.type === 'server' || touchedFields[name]
                      ? errors[name]?.message
                      : name === 'password'
                        ? verificationError?.message
                        : undefined
                }
                hasDesignMessagesOnly={
                  errors[name]?.type !== 'server' &&
                  !(name === 'password' && verificationError?.message)
                }
                inputEndAccessory={
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${label} ${visible[name] ? '숨기기' : '보기'}`}
                    onPress={() =>
                      setVisible((current) => ({ ...current, [name]: !current[name] }))
                    }
                    className="h-full justify-center px-[16px]"
                  >
                    <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-tertiary text-no-font-padding">
                      {visible[name] ? '숨기기' : '보기'}
                    </Text>
                  </Pressable>
                }
              />
            )}
          />
        ))}
      </View>
      <View className="flex-1" />
      <View className="gap-[12px]">
        <View className="rounded-auth-notice bg-motu-bg-secondary px-[14px] py-[12px]">
          <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-text-secondary text-no-font-padding">
            변경이 완료되면 기존 로그인 세션이 모두 종료됩니다.
          </Text>
        </View>
        <Button
          appearance="auth"
          title="비밀번호 변경"
          disabled={!canSubmit}
          onPress={handleComplete}
        />
      </View>
    </AuthFlowLayout>
  );
}
