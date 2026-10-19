import { zodResolver } from '@hookform/resolvers/zod';
import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch, type FieldErrors } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { OrderCompleteStep } from '@/components/productDetail/OrderCompleteStep';
import { OrderConfirmStep } from '@/components/productDetail/OrderConfirmStep';
import { OrderInputStep } from '@/components/productDetail/OrderInputStep';
import { Toast } from '@/components/Toast';
import { MIN_ORDER_QUANTITY, ORDER_SIDE_STYLES } from '@/constants/order';
import { createOrderSchema, type OrderForm } from '@/schemas/orderSchema';
import type { OrderSide, OrderStep, SubmittedOrder } from '@/types/order';
import { formatOrderedAt, getOrderAmounts, parseOrderNumber } from '@/utils/order';

cssInterop(Image, { className: 'style' });

type OrderSheetProps = {
  side: OrderSide;
  productName: string;
  currentPrice: number;
  changeRate: number;
  tickSize: number;
  availablePoints: number;
  sellableQuantity: number;
  onClose: () => void;
  onHistoryPress: () => void;
};

const BOTTOM_PADDING = 24;

export function OrderSheet({
  side,
  productName,
  currentPrice,
  changeRate,
  tickSize,
  availablePoints,
  sellableQuantity,
  onClose,
  onHistoryPress,
}: OrderSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const [step, setStep] = useState<OrderStep>('input');
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const sideStyle = ORDER_SIDE_STYLES[side];

  const schema = useMemo(
    () => createOrderSchema({ side, tickSize, availablePoints, sellableQuantity }),
    [side, tickSize, availablePoints, sellableQuantity],
  );
  // 열 때마다 새로 마운트되며 현재가(호가 단위로 맞춤)와 최소 주문 수량으로 시작합니다.
  const { control, handleSubmit, setValue } = useForm<OrderForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: (Math.round(currentPrice / tickSize) * tickSize).toLocaleString('ko-KR'),
      quantity: MIN_ORDER_QUANTITY.toLocaleString('ko-KR'),
    },
  });
  const [price, quantity] = useWatch({ control, name: ['price', 'quantity'] });
  const amounts = getOrderAmounts(side, parseOrderNumber(price), parseOrderNumber(quantity));

  const handleToastHide = useCallback(() => setToastMessage(null), []);

  const handleInvalid = (errors: FieldErrors<OrderForm>) =>
    setToastMessage(errors.price?.message ?? errors.quantity?.message ?? null);

  const handleConfirmPress = () => void handleSubmit(() => setStep('confirm'), handleInvalid)();

  // 서버 연동 전까지는 제출 즉시 완료 화면으로 넘어갑니다.
  const handleSubmitPress = () => {
    setSubmittedOrder({ ...amounts, orderedAt: formatOrderedAt(new Date()) });
    setStep('complete');
  };

  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose} statusBarTranslucent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1 justify-end"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${sideStyle.label} 주문 닫기`}
          onPress={onClose}
          className="absolute inset-0 bg-motu-black/45"
        />
        <View
          accessibilityViewIsModal
          className="max-h-[92%] overflow-hidden rounded-t-[20px] bg-white"
        >
          <View className="h-14 flex-row items-center justify-between px-6 pb-1 pt-5">
            <View className="flex-shrink flex-row items-center gap-2">
              <Text
                accessibilityRole="header"
                numberOfLines={1}
                className="flex-shrink font-pretendard-bold text-[17px] leading-[25.5px] text-motu-black"
              >
                {`${productName} ${sideStyle.label}`}
              </Text>
              {step === 'input' && (
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full ${sideStyle.bgClassName}`}
                >
                  <Text className="font-pretendard-bold text-xs leading-[18px] text-white">
                    {sideStyle.badgeLabel}
                  </Text>
                </View>
              )}
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="닫기"
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full active:opacity-60"
            >
              <Image
                source={require('../../../assets/icons/order/close.svg')}
                contentFit="contain"
                className="h-5 w-5"
                accessible={false}
              />
            </Pressable>
          </View>

          <ScrollView
            className="flex-grow-0"
            contentContainerClassName="px-6 pb-5 pt-3"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {step === 'input' && (
              <OrderInputStep
                side={side}
                currentPrice={currentPrice}
                changeRate={changeRate}
                tickSize={tickSize}
                control={control}
                setValue={setValue}
                amounts={amounts}
              />
            )}
            {step === 'confirm' && (
              <OrderConfirmStep
                side={side}
                amounts={amounts}
                availablePoints={availablePoints}
                sellableQuantity={sellableQuantity}
              />
            )}
            {step === 'complete' && submittedOrder && (
              <OrderCompleteStep side={side} order={submittedOrder} />
            )}
          </ScrollView>

          {/* 하단 안전 영역 높이는 기기마다 달라 style로 더합니다. */}
          <View
            className="gap-2 border-t border-motu-grey-lighter px-6 pt-[17px]"
            style={{ paddingBottom: BOTTOM_PADDING + bottom }}
          >
            {step === 'input' && (
              <Button
                title={`${sideStyle.label} 주문 확인`}
                color={sideStyle.buttonColor}
                onPress={handleConfirmPress}
              />
            )}
            {step === 'confirm' && (
              <>
                <Button
                  title={`${sideStyle.label} 주문 제출`}
                  color={sideStyle.buttonColor}
                  onPress={handleSubmitPress}
                />
                <Button title="취소" variant="secondary" onPress={onClose} />
              </>
            )}
            {step === 'complete' && (
              <>
                <Button title="주문 내역 보기" variant="secondary" onPress={onHistoryPress} />
                <Button title="확인" color={sideStyle.buttonColor} onPress={onClose} />
              </>
            )}
          </View>

          <View
            pointerEvents="none"
            className="absolute inset-x-0"
            style={{ bottom: BOTTOM_PADDING + bottom + 76 }}
          >
            <Toast message={toastMessage} onHide={handleToastHide} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
