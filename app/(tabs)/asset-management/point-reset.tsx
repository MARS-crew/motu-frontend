import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { getPointResetReason, usePointPreviewStore } from '@/stores/usePointPreviewStore';

export default function PointResetScreen() {
  const state = usePointPreviewStore();
  const { resetPoints } = state;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const disabledReason = getPointResetReason(state, now);
  const canReset = disabledReason === null;
  const handleBack = () => router.replace('/asset-management');
  const handleReset = () => {
    if (resetPoints()) router.replace('/asset-management/point-reset-complete');
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="포인트 리셋" onBack={handleBack} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 px-6 pb-10 pt-2">
          <View className="rounded-xl border border-motu-grey-lighter bg-white p-4">
            <Text className="font-pretendard text-xs text-motu-grey">보유 포인트</Text>
            <Text className="mt-2 font-pretendard text-[11px] text-motu-grey">예수금</Text>
            {/* 퍼블리싱 시안의 예수금 표시값 */}
            <Text className="mt-1 font-pretendard-bold text-[22px] text-motu-black">
              2,345,678 P
            </Text>
          </View>
          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-pretendard-bold text-sm text-motu-black">포인트 리셋</Text>
            <Text className="mt-2.5 font-pretendard text-xs leading-5 text-motu-black">
              아래 조건을 모두 달성할 시, 포인트 리셋이 가능합니다. 포인트는 초기 지급 포인트인
              3,000,000P로 리셋되며 거래 내역, 관심 상품 목록 등의 정보가 모두 삭제됩니다. 삭제된
              정보는 복구가 불가능합니다.
            </Text>
            <View className="mt-3 gap-1.5">
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 보유 상품이 0개인 경우
              </Text>
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 미체결 주문이 0건인 경우
              </Text>
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 처리 중인 거래가 0건인 경우
              </Text>
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 주문에 예약된 포인트가 0P인 경우
              </Text>
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 마지막 포인트 리셋 시점으로부터 7일 이상 경과한 경우
              </Text>
            </View>
            {!canReset && (
              <Text
                accessibilityLiveRegion="polite"
                className="mt-4 font-pretendard-semibold text-xs leading-5 text-motu-red"
              >
                {disabledReason}
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canReset }}
              disabled={!canReset}
              onPress={handleReset}
              className={`mt-4 min-h-11 items-center justify-center rounded-xl py-4 ${canReset ? 'bg-motu-btn-red active:opacity-50' : 'bg-motu-grey-chip'}`}
            >
              <Text
                className={`text-center font-pretendard-bold text-[13px] ${canReset ? 'text-white' : 'text-motu-grey-light'}`}
              >
                포인트 리셋 신청
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
