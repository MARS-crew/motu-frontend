import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { POINT_GRANT_AMOUNT } from '@/stores/usePointPreviewStore';
import { usePointGrantStatus } from '@/hooks/usePointGrantStatus';
import { formatPointGrantDate, formatPointGrantRemainingTime } from '@/utils/pointGrant';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function PointGrantScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { status, canGrant, remainingSeconds, errorMessage, isFetching, refetch } =
    usePointGrantStatus();
  const grantAmount = status?.amount ?? POINT_GRANT_AMOUNT;
  const handleBack = () => router.replace('/asset-management');
  const handleGrant = () => {
    if (!canGrant) return;
    // 실제 지급 API는 별도 연동합니다. 조회만으로 잔액을 변경하거나 완료 화면으로 이동하지 않습니다.
    void refetch();
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="포인트 추가 지급" onBack={handleBack} />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 px-6 pb-10 pt-2">
          <View className="rounded-xl border border-motu-grey-lighter bg-white p-4">
            <Text className="font-pretendard text-xs text-motu-grey">보유 포인트</Text>
            <Text className="mt-2 font-pretendard text-[11px] text-motu-grey">예수금</Text>
            <Text className="mt-1 font-pretendard-bold text-[22px] text-motu-black">
              {status
                ? `${status.cash.toLocaleString('ko-KR')} P`
                : isFetching
                  ? '조회 중...'
                  : '-'}
            </Text>
          </View>
          <View className="rounded-xl border border-motu-grey-lighter bg-white px-4 pb-[19px] pt-[21px]">
            <Text className="font-pretendard-bold text-sm text-motu-black">포인트 추가 지급</Text>
            <Text className="mt-2.5 font-pretendard text-xs leading-5 text-motu-black">
              {grantAmount.toLocaleString('ko-KR')}P를 추가로 받아 투자에 활용해 보세요.
            </Text>
            <View className="mt-3 gap-1.5">
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 1회 {grantAmount.toLocaleString('ko-KR')}P 지급
              </Text>
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 포인트 지급 후 24시간이 지나야 다시 수령 가능
              </Text>
              <Text className="font-pretendard text-xs leading-5 text-motu-grey">
                - 지급된 포인트는 기존 포인트와 합산되어 상품 거래에 사용 가능
              </Text>
            </View>
            <Text className="mt-3.5 font-pretendard text-xs leading-5 text-motu-grey">
              추가 포인트를 포함한 현재 보유 포인트를 기준으로 자산 리셋 조건이 적용됩니다.
            </Text>
            {!errorMessage && remainingSeconds > 0 && (
              <View className="mt-4" accessibilityLiveRegion="polite">
                <Text className="font-pretendard-semibold text-xs leading-5 text-motu-red">
                  포인트 지급 후 24시간이 지나지 않았습니다.
                </Text>
                <Text className="font-pretendard-semibold text-xs leading-5 text-motu-grey-light">
                  남은 시간: {formatPointGrantRemainingTime(remainingSeconds)}
                </Text>
                {status?.nextAvailableAt && (
                  <Text className="mt-1 font-pretendard text-[11px] leading-4 text-motu-grey">
                    다음 지급 가능 시간: {formatPointGrantDate(status.nextAvailableAt)}
                  </Text>
                )}
              </View>
            )}
            {errorMessage && (
              <View className="mt-4" accessibilityLiveRegion="polite">
                <Text className="font-pretendard-semibold text-xs leading-5 text-motu-red">
                  {errorMessage}
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
                className={`text-center font-pretendard-bold text-[13px] ${canGrant ? 'text-white' : 'text-motu-grey-light'}`}
              >
                {isFetching ? '지급 가능 여부 확인 중...' : '포인트 추가 지급 신청'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
