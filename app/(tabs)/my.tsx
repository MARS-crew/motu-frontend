import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MyScreen() {
  const handleListingApplicationPress = () => router.push('/listing-application');
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">마이</Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleListingApplicationPress}
          className="mt-6 rounded-xl bg-motu-black px-6 py-4 active:opacity-60"
        >
          <Text className="font-pretendard-semibold text-base text-white">상장 신청</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
