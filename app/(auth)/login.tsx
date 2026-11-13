import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { LoginHeader } from '@/components/login/LoginHeader';
import { SecuritySetupModal } from '@/components/login/SecuritySetupModal';
import { TextField } from '@/components/TextField';
import { useLoginMutation } from '@/queries/useLoginMutation';
import { loginSchema, type LoginForm } from '@/schemas/authSchema';
import { getApiErrorMessage } from '@/utils/apiError';

export default function LoginScreen() {
  // 개발 환경에서만 Figma의 실패 화면을 API 요청 없이 확인합니다.
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  const isErrorPreview = __DEV__ && preview === 'error';
  const [hasPreviewError, setHasPreviewError] = useState(isErrorPreview);
  const [isSecurityPreviewVisible, setIsSecurityPreviewVisible] = useState(
    __DEV__ && preview === 'security',
  );
  const handleCloseSecurityPreview = () => setIsSecurityPreviewVisible(false);
  const passwordRef = useRef<TextInput>(null);
  const { control, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: isErrorPreview
      ? { loginId: 'jinwu0613', password: '12345678' }
      : { loginId: '', password: '' },
  });
  const [loginId, password] = useWatch({ control, name: ['loginId', 'password'] });
  const { mutate: login, isPending, error, reset } = useLoginMutation();
  const canSubmit = Boolean(loginId.trim() && password);
  const hasCredentialError = isAxiosError(error) && error.response?.status === 401;
  const errorMessage =
    hasPreviewError || hasCredentialError
      ? '아이디 또는 비밀번호를 확인해 주세요.'
      : error
        ? getApiErrorMessage(error)
        : null;

  const handleLogin = handleSubmit((form) => {
    if (isPending) return;
    setHasPreviewError(false);
    login(form);
  });
  const handleEdit = () => {
    setHasPreviewError(false);
    if (error) reset();
  };
  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  };

  if (__DEV__ && (preview === 'locked' || preview === 'suspended')) {
    return (
      <Redirect
        href={{
          pathname: '/(auth)/account-restriction',
          params: { type: preview, preview: 'true' },
        }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LoginHeader onBack={handleBack} />
        <ScrollView
          className="flex-1"
          contentContainerClassName="grow gap-[24px] px-[24px] pb-[32px] pt-[12px]"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-[6px]">
            <Text
              accessibilityRole="header"
              className="font-pretendard-bold text-[24px] leading-[32px] text-motu-text-primary text-no-font-padding"
            >
              로그인
            </Text>
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
              모투 계정으로 로그인해 주세요.
            </Text>
          </View>
          {errorMessage && (
            <View
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              className="rounded-auth-notice bg-motu-red-light px-[14px] py-[12px]"
            >
              <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-btn-red text-no-font-padding">
                {errorMessage}
              </Text>
              {hasPreviewError && (
                <Text className="font-pretendard-medium text-[12px] leading-[16px] text-motu-btn-red text-no-font-padding">
                  실패 횟수 1/5회 · 4회 남음
                </Text>
              )}
            </View>
          )}
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
                    handleEdit();
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="username"
                  textContentType="username"
                  placeholder="아이디를 입력해 주세요."
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  editable={!isPending}
                  errorMessage={formState.errors.loginId?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur, ref } }) => (
                <TextField
                  variant="auth"
                  label="비밀번호"
                  inputRef={(input) => {
                    passwordRef.current = input;
                    ref(input);
                  }}
                  value={value}
                  onChangeText={(text) => {
                    handleEdit();
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="current-password"
                  textContentType="password"
                  secureTextEntry
                  placeholder="비밀번호를 입력해 주세요."
                  returnKeyType="go"
                  onSubmitEditing={() => {
                    if (canSubmit) void handleLogin();
                  }}
                  editable={!isPending}
                  errorMessage={formState.errors.password?.message}
                />
              )}
            />
          </View>
          <View className="gap-[16px]">
            <Button
              appearance="auth"
              title="로그인"
              onPress={handleLogin}
              isLoading={isPending}
              disabled={!canSubmit}
            />
            <View className="flex-row items-center justify-center gap-[8px]">
              <Pressable accessibilityRole="button" hitSlop={10}>
                <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
                  아이디 찾기
                </Text>
              </Pressable>
              <Text
                accessible={false}
                className="font-pretendard-medium text-[13px] leading-[18px] text-motu-border text-no-font-padding"
              >
                |
              </Text>
              <Pressable accessibilityRole="button" hitSlop={10}>
                <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary text-no-font-padding">
                  비밀번호 재설정
                </Text>
              </Pressable>
            </View>
          </View>
          <View className="min-h-px flex-1" />
          <Button appearance="auth" title="회원가입" variant="secondary" />
        </ScrollView>
      </KeyboardAvoidingView>
      <SecuritySetupModal
        isVisible={isSecurityPreviewVisible}
        onClose={handleCloseSecurityPreview}
        onSetupPress={handleCloseSecurityPreview}
      />
    </SafeAreaView>
  );
}
