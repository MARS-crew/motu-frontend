import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';

import { TopBar } from '@/components/TopBar';
import { usePointGrantResultQuery } from '@/queries/usePointGrantMutation';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatPointGrantDate } from '@/utils/pointGrant';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function PointGrantCompleteScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { data: receipt } = usePointGrantResultQuery();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const handleConfirm = () => router.replace('/asset-management');
  if (!receipt || !isLoggedIn) return <Redirect href="/asset-management/point-grant" />;
  const nextGrantLabel = formatPointGrantDate(receipt.nextAvailableAt);

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="포인트 추가 지급" onBack={handleConfirm} />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pb-10">
          <View className="items-center pb-8 pt-10">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-motu-green/10">
              <Image
                source={require('../../../assets/icons/check.svg')}
                className="h-[10px] w-[14px]"
              />
            </View>
            <Text className="mt-4 text-center font-pretendard-bold text-sm text-motu-black">
              포인트 지급이 완료되었습니다
            </Text>
            <Text className="mt-2 font-pretendard-bold text-[22px] text-motu-green">
              +{receipt.amount.toLocaleString('ko-KR')} P
            </Text>
          </View>
          <View className="gap-3.5">
            <View className="flex-row justify-between">
              <Text className="font-pretendard text-xs text-motu-grey">지급 전</Text>
              <Text className="font-pretendard-semibold text-xs text-motu-black">
                {receipt.cashBefore.toLocaleString('ko-KR')} P
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-pretendard text-xs text-motu-grey">지급 후</Text>
              <Text className="font-pretendard-semibold text-xs text-motu-black">
                {receipt.cashAfter.toLocaleString('ko-KR')} P
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="font-pretendard text-xs text-motu-grey">다음 지급 가능 시간</Text>
              <View className="items-end">
                <Text className="font-pretendard-semibold text-xs text-motu-black">24시간 후</Text>
                <Text className="mt-0.5 font-pretendard text-[11px] text-motu-grey-light">
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
            <Text className="font-pretendard-bold text-[13px] text-white">확인</Text>
          </Pressable>
          <Text className="mt-4 text-center font-pretendard text-[11px] text-motu-grey-light">
            지급 내역은 포인트 변경 이력에 저장됩니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
