import { Text, View } from 'react-native';

import { OrderInfoRow, OrderTotalRow } from '@/components/productDetail/OrderInfoRow';
import { ORDER_SIDE_STYLES } from '@/constants/order';
import type { OrderAmounts, OrderSide } from '@/types/order';

type OrderConfirmStepProps = {
  side: OrderSide;
  amounts: OrderAmounts;
  availablePoints: number;
  sellableQuantity: number;
};

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

export function OrderConfirmStep({
  side,
  amounts,
  availablePoints,
  sellableQuantity,
}: OrderConfirmStepProps) {
  const sideStyle = ORDER_SIDE_STYLES[side];
  const isBuy = side === 'buy';

  return (
    <View className="pt-1">
      <View className="gap-3 rounded-xl bg-motu-grey-lighter/40 p-4">
        <OrderInfoRow label="주문 가격" value={`${formatNumber(amounts.price)}P`} />
        <OrderInfoRow label="주문 수량" value={`${formatNumber(amounts.quantity)}주`} />
        <OrderInfoRow label="주문 금액" value={`${formatNumber(amounts.amount)}P`} />
        <View>
          <OrderInfoRow label="예상 수수료" value={`${formatNumber(amounts.fee)}P`} />
          <Text className="mt-2 font-pretendard text-[10px] leading-[15px] text-motu-grey">
            거래 수수료는 주문의 실제 체결금액을 기준으로 0.02%를 부과합니다.
          </Text>
        </View>
      </View>

      <OrderTotalRow
        label={isBuy ? '총 주문 금액' : '총 수령 금액'}
        value={`${formatNumber(amounts.total)}P`}
        valueClassName={sideStyle.textClassName}
      />
      {/* 매수는 사용 가능 포인트, 매도는 매도 가능 수량을 보여줍니다. (화면설계서 USR-MARKET-02-M03, M06) */}
      <View className="mt-3">
        <OrderInfoRow
          label={isBuy ? '사용 가능 금액' : '매도 가능 수량'}
          value={
            isBuy ? `${formatNumber(availablePoints)}P` : `${formatNumber(sellableQuantity)}주`
          }
        />
      </View>

      <Text className="mt-6 text-center font-pretendard-medium text-sm leading-[21px] text-motu-black">
        {`위 내용으로 ${sideStyle.label} 주문을 제출하시겠습니까?`}
      </Text>
    </View>
  );
}
