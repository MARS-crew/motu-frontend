import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { AuthFlowBadge, AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { RecoveryStatusIcon } from '@/components/recovery/RecoveryStatusIcon';
import { TextField } from '@/components/TextField';
import { resetPasswordSchema, type ResetPasswordForm } from '@/schemas/accountRecoverySchema';

const PASSWORD_FIELDS = [
  ['password', '새 비밀번호'],
  ['confirmPassword', '새 비밀번호 확인'],
] as const;

export default function NewPasswordScreen() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const [isComplete, setIsComplete] = useState(false);
  const [visible, setVisible] = useState({ password: false, confirmPassword: false });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, errors, touchedFields },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onTouched',
    defaultValues: { password: '', confirmPassword: '' },
  });
  const [password, confirmation] = useWatch({ control, name: ['password', 'confirmPassword'] });
  const hasMismatch =
    touchedFields.confirmPassword && confirmation !== '' && password !== confirmation;

  if (!__DEV__) return <Redirect href="/login" />;

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/reset-password');
  };
  const handleLogin = () => router.dismissTo('/login');
  const handleComplete = handleSubmit(() => {
    reset();
    setIsComplete(true);
  });

  if (preview === 'expired') {
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

  if (isComplete) {
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
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <TextField
                variant="auth"
                label={label}
                inputRef={ref}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!visible[name]}
                errorMessage={
                  name === 'confirmPassword' && hasMismatch
                    ? '비밀번호가 일치하지 않습니다. 다시 입력해 주세요.'
                    : touchedFields[name]
                      ? errors[name]?.message
                      : undefined
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
          disabled={!isValid}
          onPress={handleComplete}
        />
      </View>
    </AuthFlowLayout>
  );
}
