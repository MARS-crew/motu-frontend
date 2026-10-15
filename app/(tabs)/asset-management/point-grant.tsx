import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import {
  POINT_GRANT_AMOUNT,
  POINT_GRANT_INTERVAL,
  usePointPreviewStore,
} from '@/stores/usePointPreviewStore';

export default function PointGrantScreen() {
  const { balance, receipt, grantPoints } = usePointPreviewStore();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const remainingTime = receipt ? Math.max(0, receipt.grantedAt + POINT_GRANT_INTERVAL - now) : 0;
  const canGrant = remainingTime === 0;
  const remainingHours = Math.ceil(remainingTime / (60 * 60 * 1000));
  const handleBack = () => router.replace('/asset-management');
  const handleGrant = () => {
    if (grantPoints()) router.replace('/asset-management/point-grant-complete');
  };

  return (
    <SafeAreaView className="bg-motu-bg flex-1">
      <TopBar title="포인트 추가 지급" onBack={handleBack} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-6 px-6 pb-10 pt-2">
          <View className="rounded-xl border border-motu-grey-lighter bg-white p-4">
            <Text className="font-inter text-xs text-motu-grey">보유 포인트</Text>
            <Text className="mt-2 font-inter text-[11px] text-motu-grey">예수금</Text>
            <Text className="mt-1 font-inter-bold text-[22px] text-motu-black">
              {balance.toLocaleString('ko-KR')} P
            </Text>
          </View>
          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-inter-bold text-sm text-motu-black">포인트 추가 지급</Text>
            <Text className="mt-2.5 font-inter text-xs leading-5 text-motu-black">
              {POINT_GRANT_AMOUNT.toLocaleString('ko-KR')}P를 추가로 받아 투자에 활용해 보세요.
            </Text>
            <View className="mt-3 gap-1.5">
              <Text className="font-inter text-xs leading-5 text-motu-grey">
                - 1회 100,000P 지급
              </Text>
              <Text className="font-inter text-xs leading-5 text-motu-grey">
                - 포인트 지급 후 24시간이 지나야 다시 수령 가능
              </Text>
              <Text className="font-inter text-xs leading-5 text-motu-grey">
                - 지급된 포인트는 기존 포인트와 합산되어 상품 거래에 사용 가능
              </Text>
            </View>
            <Text className="mt-3.5 font-inter text-xs leading-5 text-motu-grey">
              추가 포인트를 포함한 현재 보유 포인트를 기준으로 자산 리셋 조건이 적용됩니다.
            </Text>
            {!canGrant && (
              <View className="mt-4" accessibilityLiveRegion="polite">
                <Text className="font-inter-semibold text-xs leading-5 text-motu-red">
                  포인트 지급 후 24시간이 지나지 않았습니다.
                </Text>
                <Text className="font-inter-semibold text-xs leading-5 text-motu-grey-light">
                  남은 시간: {remainingHours}시간
                </Text>
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canGrant }}
              disabled={!canGrant}
              onPress={handleGrant}
              className={`mt-4 min-h-11 items-center justify-center rounded-xl py-4 ${canGrant ? 'bg-motu-black active:opacity-50' : 'bg-motu-grey-chip'}`}
            >
              <Text
                className={`text-center font-inter-bold text-[13px] ${canGrant ? 'text-white' : 'text-motu-grey-light'}`}
              >
                포인트 추가 지급 신청
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
