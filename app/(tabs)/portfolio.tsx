import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PortfolioScreen() {
  const handleAssetManagementPress = () => router.push('/asset-management');

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold">포트폴리오</Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleAssetManagementPress}
          className="mt-6 rounded-xl bg-motu-black px-6 py-4 active:opacity-80"
        >
          <Text className="font-inter-semibold text-base text-white">자산관리</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
