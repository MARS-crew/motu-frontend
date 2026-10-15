import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { TopBar } from '@/components/TopBar';
import {
  POINT_GRANT_AMOUNT,
  POINT_GRANT_INTERVAL,
  usePointPreviewStore,
} from '@/stores/usePointPreviewStore';

export default function PointGrantCompleteScreen() {
  const receipt = usePointPreviewStore((state) => state.receipt);
  const handleConfirm = () => router.replace('/asset-management');
  if (!receipt) return <Redirect href="/asset-management/point-grant" />;
  const nextGrantAt = new Date(receipt.grantedAt + POINT_GRANT_INTERVAL);
  const nextGrantLabel = `${nextGrantAt.getFullYear()}.${String(nextGrantAt.getMonth() + 1).padStart(2, '0')}.${String(nextGrantAt.getDate()).padStart(2, '0')} ${String(nextGrantAt.getHours()).padStart(2, '0')}:${String(nextGrantAt.getMinutes()).padStart(2, '0')}`;

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="포인트 추가 지급" onBack={handleConfirm} />
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
              포인트 지급이 완료되었습니다
            </Text>
            <Text className="mt-2 font-inter-bold text-[22px] text-motu-green">
              +{POINT_GRANT_AMOUNT.toLocaleString('ko-KR')} P
            </Text>
          </View>
          <View className="gap-3.5">
            <View className="flex-row justify-between">
              <Text className="font-inter text-xs text-motu-grey">지급 전</Text>
              <Text className="font-inter-semibold text-xs text-motu-black">
                {receipt.previousBalance.toLocaleString('ko-KR')} P
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-inter text-xs text-motu-grey">지급 후</Text>
              <Text className="font-inter-semibold text-xs text-motu-black">
                {receipt.balance.toLocaleString('ko-KR')} P
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-inter text-xs text-motu-grey">다음 지급 가능 시간</Text>
              <View className="items-end">
                <Text className="font-inter-semibold text-xs text-motu-black">24시간 후</Text>
                <Text className="mt-0.5 font-inter text-[11px] text-motu-grey-light">
                  ({nextGrantLabel})
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
            지급 내역은 포인트 변경 이력에 저장됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
