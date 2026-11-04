import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';

import { useMyAccountQuery } from '@/queries/useMyAccountQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function AssetManagementScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // 예수금은 포트폴리오와 같은 값(매수 주문에 예약된 포인트 포함)을 보여줍니다.
  const { data: account, isFetching, refetch } = useMyAccountQuery();

  // 탭 화면은 계속 마운트되어 있어, 다시 들어올 때마다 체결·포인트 변경이 반영된 예수금을 새로 불러옵니다.
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) void refetch({ cancelRefetch: false });
    }, [isLoggedIn, refetch]),
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/portfolio');
    }
  };

  const handlePointGrant = () => router.push('/asset-management/point-grant');

  const handlePointReset = () => router.push('/asset-management/point-reset');

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="자산관리" onBack={handleBack} />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-3 px-6 pt-2">
          <View className="rounded-xl border border-motu-grey-lighter bg-white p-4">
            <Text className="font-pretendard text-xs text-motu-grey">보유 포인트</Text>
            <Text className="mt-2 font-pretendard text-[11px] text-motu-grey">예수금</Text>
            <Text className="mt-1 font-pretendard-bold text-[22px] text-motu-black">
              {account
                ? `${account.cash.toLocaleString('ko-KR')} P`
                : isFetching
                  ? '조회 중...'
                  : '-'}
            </Text>
          </View>

          <Text
            accessibilityRole="header"
            className="mt-3 font-pretendard-bold text-[13px] text-motu-black"
          >
            포인트 처리 선택
          </Text>

          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-pretendard-bold text-sm text-motu-black">포인트 추가 지급</Text>
            <Text className="mt-2 font-pretendard text-xs leading-6 text-motu-grey">
              모의투자 포인트를 추가로 지급받아 거래에 활용합니다. 지급 조건과 처리 결과는 다음
              화면에서 안내합니다.
            </Text>
            <Text className="mt-3 font-pretendard text-[11px] leading-5 text-motu-grey-light">
              유의사항: 실제 자산 또는 수익과 무관한 모의투자 전용 포인트입니다.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handlePointGrant}
              className="mt-4 min-h-11 items-center justify-center rounded-xl bg-motu-black py-4 active:opacity-50"
            >
              <Text className="text-center font-pretendard-bold text-[13px] text-white">
                포인트 추가 지급 신청
              </Text>
            </Pressable>
          </View>
          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-pretendard-bold text-sm text-motu-black">포인트 리셋</Text>
            <Text className="mt-2 font-pretendard text-xs leading-6 text-motu-grey">
              보유 포인트와 거래 내역을 초기 상태로 되돌립니다. 리셋 조건과 처리 결과는 다음
              화면에서 안내합니다.
            </Text>
            <Text className="mt-3 font-pretendard text-[11px] leading-5 text-motu-grey-light">
              유의사항: 리셋 후 포인트와 거래 기록은 복구되지 않습니다.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={handlePointReset}
              className="mt-5 min-h-11 items-center justify-center rounded-xl bg-motu-btn-red py-4 active:opacity-50"
            >
              <Text className="text-center font-pretendard-bold text-[13px] text-white">
                포인트 리셋 신청
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
