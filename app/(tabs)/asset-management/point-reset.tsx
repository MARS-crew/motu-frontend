import { router } from 'expo-router';
import { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { usePointResetStatus } from '@/hooks/usePointResetStatus';
import { usePointResetMutation } from '@/queries/usePointResetMutation';
import { getPointResetRequestErrorMessage } from '@/utils/pointReset';
import { formatPointGrantDate, formatPointGrantRemainingTime } from '@/utils/pointGrant';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function PointResetScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { status, canReset, remainingSeconds, errorMessage, isFetching } = usePointResetStatus();
  const resetMutation = usePointResetMutation();
  const isSubmitting = useRef(false);
  const canSubmit = canReset && !resetMutation.isPending;
  const disabledReason = resetMutation.error
    ? getPointResetRequestErrorMessage(resetMutation.error)
    : errorMessage;
  const handleBack = () => router.replace('/asset-management');
  const handleReset = async () => {
    if (!canSubmit || isSubmitting.current) return;
    isSubmitting.current = true;
    try {
      await resetMutation.mutateAsync();
      router.replace('/asset-management/point-reset-complete');
    } catch {
      // 서버가 리셋을 완료한 경우에만 결과 화면으로 이동합니다.
    } finally {
      isSubmitting.current = false;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="포인트 리셋" onBack={handleBack} />
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
            <Text className="font-pretendard-bold text-sm text-motu-black">포인트 리셋</Text>
            <Text className="mt-2.5 font-pretendard text-xs leading-5 text-motu-black">
              아래 조건을 모두 달성할 시, 포인트 리셋이 가능합니다. 포인트는 초기 지급 포인트인
              {status ? status.resetCash.toLocaleString('ko-KR') : '3,000,000'}P로 리셋되며 거래
              내역, 관심 상품 목록 등의 정보가 모두 삭제됩니다. 삭제된 정보는 복구가 불가능합니다.
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
            {disabledReason && (
              <Text
                accessibilityLiveRegion="polite"
                className="mt-4 font-pretendard-semibold text-xs leading-5 text-motu-red"
              >
                {disabledReason}
              </Text>
            )}
            {remainingSeconds > 0 && (
              <View className="mt-2">
                <Text className="font-pretendard-semibold text-xs leading-5 text-motu-grey-light">
                  남은 시간: {formatPointGrantRemainingTime(remainingSeconds)}
                </Text>
                {status?.nextAvailableAt && (
                  <Text className="mt-1 font-pretendard text-[11px] leading-4 text-motu-grey">
                    다음 리셋 가능 시간: {formatPointGrantDate(status.nextAvailableAt)}
                  </Text>
                )}
              </View>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit }}
              disabled={!canSubmit}
              onPress={handleReset}
              className={`mt-4 min-h-11 items-center justify-center rounded-xl py-4 ${canSubmit ? 'bg-motu-btn-red active:opacity-50' : 'bg-motu-grey-chip'}`}
            >
              <Text
                className={`text-center font-pretendard-bold text-[13px] ${canSubmit ? 'text-white' : 'text-motu-grey-light'}`}
              >
                {resetMutation.isPending
                  ? '포인트 리셋 중...'
                  : isFetching
                    ? '리셋 가능 여부 확인 중...'
                    : '포인트 리셋 신청'}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
