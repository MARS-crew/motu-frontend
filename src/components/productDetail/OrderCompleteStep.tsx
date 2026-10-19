import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

import { OrderInfoRow } from '@/components/productDetail/OrderInfoRow';
import { ORDER_SIDE_STYLES } from '@/constants/order';
import type { OrderSide, SubmittedOrder } from '@/types/order';

cssInterop(Image, { className: 'style' });

type OrderCompleteStepProps = {
  side: OrderSide;
  order: SubmittedOrder;
};

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

export function OrderCompleteStep({ side, order }: OrderCompleteStepProps) {
  const sideStyle = ORDER_SIDE_STYLES[side];

  return (
    <View>
      <View className="items-center pt-6">
        <View
          className={`h-16 w-16 items-center justify-center rounded-full ${sideStyle.bgClassName}`}
        >
          <Image
            source={require('../../../assets/icons/order/check.svg')}
            contentFit="contain"
            className="h-[34px] w-[34px]"
            accessible={false}
          />
        </View>
        <Text
          accessibilityLiveRegion="polite"
          className={`mt-4 font-pretendard-semibold text-[15px] leading-[22.5px] ${sideStyle.textClassName}`}
        >
          {`${sideStyle.label} 주문이 제출되었습니다.`}
        </Text>
      </View>

      <View className="mt-7 gap-3">
        <OrderInfoRow label="주문 가격" value={`${formatNumber(order.price)}P`} />
        <OrderInfoRow label="주문 수량" value={`${formatNumber(order.quantity)}주`} />
        <OrderInfoRow label="주문 금액" value={`${formatNumber(order.amount)}P`} />
        <OrderInfoRow label="주문 시간" value={order.orderedAt} />
      </View>
    </View>
  );
}
