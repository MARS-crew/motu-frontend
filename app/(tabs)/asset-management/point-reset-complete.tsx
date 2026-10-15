import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { TopBar } from '@/components/TopBar';
import { POINT_RESET_INTERVAL, usePointPreviewStore } from '@/stores/usePointPreviewStore';

export default function PointResetCompleteScreen() {
  const receipt = usePointPreviewStore((state) => state.resetReceipt);
  const handleConfirm = () => router.replace('/asset-management');
  if (!receipt) return <Redirect href="/asset-management/point-reset" />;
  const nextResetAt = new Date(receipt.resetAt + POINT_RESET_INTERVAL);
  const nextResetLabel = `${nextResetAt.getFullYear()}.${String(nextResetAt.getMonth() + 1).padStart(2, '0')}.${String(nextResetAt.getDate()).padStart(2, '0')} ${String(nextResetAt.getHours()).padStart(2, '0')}:${String(nextResetAt.getMinutes()).padStart(2, '0')}`;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="포인트 리셋" onBack={handleConfirm} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pb-10">
          <View className="items-center pb-8 pt-10">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-motu-green/10">
              <Image
                source={require('../../../assets/icons/check.svg')}
                className="h-[10px] w-[14px]"
              />
            </View>
            <Text className="mt-4 text-center font-inter-bold text-sm text-motu-black">
              포인트 리셋이 완료되었습니다
            </Text>
            <Text className="mt-2 font-inter-bold text-[22px] text-motu-black">
              {receipt.balance.toLocaleString('ko-KR')} P
            </Text>
          </View>
          <View className="gap-3.5">
            <View className="flex-row justify-between">
              <Text className="font-inter text-xs text-motu-grey">리셋 전</Text>
              <Text className="font-inter-semibold text-xs text-motu-black">
                {receipt.previousBalance.toLocaleString('ko-KR')} P
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-inter text-xs text-motu-grey">리셋 후</Text>
              <Text className="font-inter-semibold text-xs text-motu-black">
                {receipt.balance.toLocaleString('ko-KR')} P
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-inter text-xs text-motu-grey">다음 리셋 가능</Text>
              <View className="items-end">
                <Text className="font-inter-semibold text-xs text-motu-black">7일 후</Text>
                <Text className="mt-0.5 font-inter text-[11px] text-motu-grey-light">
                  ({nextResetLabel})
                </Text>
              </View>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={handleConfirm}
            className="mt-9 min-h-11 items-center justify-center rounded-xl bg-motu-black py-4 active:opacity-50"
          >
            <Text className="font-inter-bold text-[13px] text-white">확인</Text>
          </Pressable>
          <Text className="mt-4 text-center font-inter text-[11px] text-motu-grey-light">
            리셋 처리 내역은 포인트 변경 이력에 저장됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
