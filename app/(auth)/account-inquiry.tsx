import { zodResolver } from '@hookform/resolvers/zod';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FormMessage } from '@/components/FormMessage';
import { AuthFlowHeading, AuthFlowLayout } from '@/components/login/AuthFlowLayout';
import { TextField } from '@/components/TextField';
import { useAccountInquiryMutation } from '@/queries/useAccountInquiryMutation';
import {
  accountInquirySchema,
  inquiryTypeSchema,
  type AccountInquiryForm,
} from '@/schemas/accountInquirySchema';
import { getAuthError } from '@/utils/authError';

export default function AccountInquiryScreen() {
  const { type } = useLocalSearchParams<{ type?: string }>();
  const inquiryType = inquiryTypeSchema.safeParse(type);
  const mutation = useAccountInquiryMutation();
  const isSubmittingRef = useRef(false);
  const { control, handleSubmit, formState } = useForm<AccountInquiryForm>({
    resolver: zodResolver(accountInquirySchema),
    mode: 'onChange',
    defaultValues: {
      inquiryType: inquiryType.success ? inquiryType.data : undefined,
      replyEmail: '',
      content: '',
    },
  });
  const handleBack = () => router.back();
  const handleSend = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      await handleSubmit(async (form) => {
        await mutation.mutateAsync(form);
      })();
    } catch {
      /* 서버에서 받은 오류만 기존 메시지 영역에 표시합니다. */
    } finally {
      isSubmittingRef.current = false;
    }
  };
  if (!inquiryType.success) return <Redirect href="/login" />;
  return (
    <AuthFlowLayout title="문의하기" onBack={handleBack}>
      {mutation.data ? (
        <>
          <AuthFlowHeading title={mutation.data.message} />
          <Text className="font-pretendard-medium text-sm text-motu-text-primary">
            {mutation.data.inquiryCode}
          </Text>
          <Text className="font-pretendard-medium text-sm text-motu-text-secondary">
            {mutation.data.createDate}
          </Text>
          <View className="flex-1" />
          <Button appearance="auth" title="확인" onPress={() => router.replace('/login')} />
        </>
      ) : (
        <>
          <AuthFlowHeading title="문의하기" />
          {(['replyEmail', 'content'] as const).map((name) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field: { ref, value, onChange, onBlur } }) => (
                <TextField
                  variant="auth"
                  label={name === 'replyEmail' ? '회신 이메일' : '문의 내용'}
                  inputRef={ref}
                  value={value}
                  onChangeText={(text) => {
                    mutation.reset();
                    onChange(text);
                  }}
                  onBlur={onBlur}
                  inputMode={name === 'replyEmail' ? 'email' : 'text'}
                  autoCapitalize="none"
                  multiline={name === 'content'}
                  multilineSize="inquiry"
                  maxLength={name === 'content' ? 5000 : 255}
                  errorMessage={formState.errors[name]?.message}
                  editable={!mutation.isPending}
                />
              )}
            />
          ))}
          <FormMessage message={getAuthError(mutation.error)?.message} isError size="double" />
          <View className="flex-1" />
          <Button
            appearance="auth"
            title="문의 접수"
            disabled={!formState.isValid}
            isLoading={mutation.isPending}
            onPress={handleSend}
          />
        </>
      )}
    </AuthFlowLayout>
  );
}
