import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import type { OpenOrderRow } from '@/utils/tradeHistory';

type CancelOrderModalProps = {
  order: OpenOrderRow | null;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  canCancel: boolean;
  errorMessage: string | null;
};

export function CancelOrderModal({
  order,
  onClose,
  onConfirm,
  isSubmitting,
  canCancel,
  errorMessage,
}: CancelOrderModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={order !== null}
      onRequestClose={isSubmitting ? undefined : onClose}
      statusBarTranslucent
    >
      <View className="flex-1 bg-black/40">
        <ScrollView
          className="flex-1"
          contentContainerClassName="relative flex-grow items-center justify-center px-7"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="주문 취소 창 닫기"
            disabled={isSubmitting}
            onPress={onClose}
            className="absolute inset-0"
          />
          {order && (
            <View
              accessibilityViewIsModal
              className="w-full max-w-md rounded-2xl border border-motu-grey-lighter bg-white px-6 py-6"
            >
              <Text
                accessibilityRole="header"
                className="text-center font-pretendard-bold text-base text-motu-black"
              >
                미체결 주문을 취소할까요?
              </Text>
              <View className="my-6 gap-4">
                <View className="flex-row justify-between gap-4">
                  <Text className="font-pretendard text-[13px] text-motu-grey">상품</Text>
                  <Text className="shrink text-right font-pretendard-bold text-[14px] text-motu-black">
                    {order.productName}
                  </Text>
                </View>
                <View className="flex-row justify-between gap-4">
                  <Text className="font-pretendard text-[13px] text-motu-grey">주문 구분</Text>
                  <Text
                    className={`font-pretendard-bold text-[14px] ${order.side === 'buy' ? 'text-motu-red' : 'text-motu-blue'}`}
                  >
                    {order.side === 'buy' ? '매수' : '매도'}
                  </Text>
                </View>
                <View className="flex-row justify-between gap-4">
                  <Text className="font-pretendard text-[13px] text-motu-grey">주문 가격</Text>
                  <Text className="font-pretendard-bold text-[14px] text-motu-black">
                    {order.orderPrice.toLocaleString('ko-KR')} P
                  </Text>
                </View>
                <View className="flex-row justify-between gap-4">
                  <Text className="font-pretendard text-[13px] text-motu-grey">취소 수량</Text>
                  <Text className="font-pretendard-bold text-[14px] text-motu-black">
                    {order.remainingQuantity.toLocaleString('ko-KR')}주
                  </Text>
                </View>
              </View>
              {errorMessage && (
                <Text
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  className="mb-4 text-center font-pretendard text-xs text-motu-red"
                >
                  {errorMessage}
                </Text>
              )}
              <View className="flex-row gap-2">
                <Pressable
                  accessibilityRole="button"
                  disabled={isSubmitting}
                  onPress={onClose}
                  className="min-h-11 flex-1 items-center justify-center rounded-lg border border-motu-grey-lighter bg-white py-3 active:opacity-50"
                >
                  <Text className="font-pretendard-semibold text-[13px] text-motu-black">
                    돌아가기
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  disabled={isSubmitting || !canCancel}
                  accessibilityState={{ disabled: isSubmitting || !canCancel, busy: isSubmitting }}
                  onPress={onConfirm}
                  className="min-h-11 flex-1 items-center justify-center rounded-lg bg-motu-black py-3 active:opacity-50"
                >
                  <Text className="font-pretendard-semibold text-[13px] text-white">주문 취소</Text>
                </Pressable>
              </View>
              <Text className="mt-4 text-center font-pretendard text-[11px] leading-5 text-motu-grey">
                취소 완료 시 예약 포인트 또는 예약 수량이 해제됩니다.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
