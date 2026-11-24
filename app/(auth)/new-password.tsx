import { useLocalSearchParams } from 'expo-router';

import { PasswordResetForm } from '@/components/recovery/PasswordResetForm';

export default function NewPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string | string[] }>();
  const resetToken = typeof token === 'string' ? token : '';
  // 다른 메일 링크로 진입하면 이전 폼·검증·완료 상태를 재사용하지 않습니다.
  return <PasswordResetForm key={resetToken} token={resetToken} />;
}
