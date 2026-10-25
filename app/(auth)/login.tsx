import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useLoginMutation } from '@/queries/useLoginMutation';
import { loginSchema, type LoginForm } from '@/schemas/authSchema';
import { getApiErrorMessage } from '@/utils/apiError';

export default function LoginScreen() {
  const { control, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: '', password: '' },
  });
  const { mutate: login, isPending, error } = useLoginMutation();

  const handleLogin = handleSubmit((form) => login(form));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center gap-4 px-6">
        <Text className="mb-4 text-3xl font-bold">MOTU</Text>
        <Controller
          control={control}
          name="loginId"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="아이디"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="아이디를 입력해 주세요"
              errorMessage={formState.errors.loginId?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="비밀번호"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              placeholder="비밀번호를 입력해 주세요"
              errorMessage={formState.errors.password?.message}
            />
          )}
        />
        {error && (
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-red">
            {getApiErrorMessage(error)}
          </Text>
        )}
        <Button title="로그인" onPress={handleLogin} isLoading={isPending} />
      </View>
    </SafeAreaView>
  );
}
