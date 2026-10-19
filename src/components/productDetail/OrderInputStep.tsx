import { Controller, type Control, type UseFormSetValue } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';

import { OrderInfoRow, OrderTotalRow } from '@/components/productDetail/OrderInfoRow';
import { OrderStepper } from '@/components/productDetail/OrderStepper';
import { MIN_ORDER_QUANTITY, ORDER_QUANTITY_PRESETS, ORDER_SIDE_STYLES } from '@/constants/order';
import type { OrderForm } from '@/schemas/orderSchema';
import type { OrderAmounts, OrderSide } from '@/types/order';
import { getChangeColorClass } from '@/utils/formatNumber';
import { formatOrderNumberInput, parseOrderNumber } from '@/utils/order';

type OrderInputStepProps = {
  side: OrderSide;
  currentPrice: number;
  changeRate: number;
  tickSize: number;
  control: Control<OrderForm>;
  setValue: UseFormSetValue<OrderForm>;
  amounts: OrderAmounts;
};

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

export function OrderInputStep({
  side,
  currentPrice,
  changeRate,
  tickSize,
  control,
  setValue,
  amounts,
}: OrderInputStepProps) {
  const sideStyle = ORDER_SIDE_STYLES[side];
  const changeAmount = Math.round(currentPrice - currentPrice / (1 + changeRate / 100));
  const changeArrow = changeAmount > 0 ? '▲ ' : changeAmount < 0 ? '▼ ' : '';
  const setNumber = (name: keyof OrderForm, value: number) =>
    setValue(name, formatNumber(value), { shouldValidate: false });

  // 호가 단위에 맞지 않는 가격을 입력한 뒤 +/-를 누르면 가까운 호가로 맞춥니다.
  const handlePriceStep = (direction: 1 | -1, price: number) => {
    const next =
      direction === 1
        ? Math.floor(price / tickSize) * tickSize + tickSize
        : Math.ceil(price / tickSize) * tickSize - tickSize;
    setNumber('price', Math.max(tickSize, next));
  };

  return (
    <View>
      <View className={`items-center rounded-xl border-2 py-[18px] ${sideStyle.borderClassName}`}>
        <Text className="font-pretendard-bold text-2xl leading-6 text-motu-black">
          {`${formatNumber(currentPrice)}P`}
        </Text>
        <Text
          className={`mt-2 font-pretendard-semibold text-xs leading-[18px] ${getChangeColorClass(changeAmount)}`}
        >
          {`${changeArrow}${formatNumber(Math.abs(changeAmount))}P (${Math.abs(changeRate).toFixed(2)}%)`}
        </Text>
      </View>

      <View className="mt-6">
        <Controller
          control={control}
          name="price"
          render={({ field: { value, onChange, onBlur } }) => (
            <OrderStepper
              label="주문 가격"
              unit="P"
              value={value}
              onChangeText={(text) => onChange(formatOrderNumberInput(text))}
              onBlur={onBlur}
              onIncrease={() => handlePriceStep(1, parseOrderNumber(value))}
              onDecrease={() => handlePriceStep(-1, parseOrderNumber(value))}
            />
          )}
        />
      </View>
      <View className="mt-4">
        <Controller
          control={control}
          name="quantity"
          render={({ field: { value, onChange, onBlur } }) => (
            <OrderStepper
              label="주문 수량"
              unit="주"
              value={value}
              onChangeText={(text) => onChange(formatOrderNumberInput(text))}
              onBlur={onBlur}
              onIncrease={() => setNumber('quantity', parseOrderNumber(value) + 1)}
              onDecrease={() =>
                setNumber('quantity', Math.max(MIN_ORDER_QUANTITY, parseOrderNumber(value) - 1))
              }
            />
          )}
        />
      </View>

      {/* 누르면 해당 수량만큼 더해집니다. */}
      <Controller
        control={control}
        name="quantity"
        render={({ field: { value } }) => (
          <View className="mt-3 flex-row gap-2">
            {ORDER_QUANTITY_PRESETS.map((preset) => (
              <Pressable
                key={preset}
                accessibilityRole="button"
                accessibilityLabel={`${preset}주 더하기`}
                onPress={() => setNumber('quantity', parseOrderNumber(value) + preset)}
                className="h-[37.5px] flex-1 items-center justify-center rounded-lg border border-motu-grey-lighter active:bg-motu-grey-lighter/40"
              >
                <Text className="font-pretendard-medium text-[13px] leading-[19.5px] text-motu-black">
                  {preset}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      />

      <View className="mt-7 gap-3">
        <OrderInfoRow label="주문 금액" value={`${formatNumber(amounts.amount)}P`} />
        <OrderInfoRow label="예상 수수료" value={`${formatNumber(amounts.fee)}P`} />
      </View>
      <OrderTotalRow
        label={side === 'buy' ? '총 주문 금액' : '총 수령 금액'}
        value={`${formatNumber(amounts.total)}P`}
        valueClassName={sideStyle.textClassName}
      />
    </View>
  );
}
