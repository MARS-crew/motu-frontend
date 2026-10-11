import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { useLoginMutation } from '@/queries/useLoginMutation';
import { loginSchema, type LoginForm } from '@/schemas/authSchema';

export default function LoginScreen() {
  const { control, handleSubmit, formState } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const { mutate: login, isPending } = useLoginMutation();

  const handleLogin = handleSubmit((form) => login(form));

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center gap-4 px-6">
        <Text className="mb-4 text-3xl font-bold">MOTU</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextField
              label="이메일"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="example@email.com"
              errorMessage={formState.errors.email?.message}
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
              placeholder="8자 이상"
              errorMessage={formState.errors.password?.message}
            />
          )}
        />
        <Button title="로그인" onPress={handleLogin} isLoading={isPending} />
      </View>
    </SafeAreaView>
  );
}
