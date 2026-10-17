import { router } from 'expo-router';
import { Pressable, Text } from 'react-native';

export function LoginRequiredBox() {
  const handlePress = () => router.push('/login');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint="로그인 화면으로 이동합니다"
      onPress={handlePress}
      className="items-center justify-center rounded-xl bg-motu-grey-lighter/60 px-4 py-6 active:opacity-60"
    >
      <Text className="text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
        자세한 내용은 로그인 후에 확인할 수 있어요.
      </Text>
    </Pressable>
  );
}
