import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TextInput, View } from 'react-native';

import {
  ProductDetailDialogButtons,
  ProductDetailDialog,
} from '@/components/productDetail/ProductDetailDialog';
import { priceAlertSchema, type PriceAlertForm } from '@/schemas/priceAlertSchema';
import { formatPoint, getChangeColorClass } from '@/utils/formatNumber';

type PriceAlertModalProps = {
  isVisible: boolean;
  currentPrice: number;
  changeRate: number;
  // 설정된 알림 가격이 있으면 수정 모달로 열립니다.
  alertPrice: number | null;
  onClose: () => void;
  onSubmit: (price: number) => void;
  onReleasePress: () => void;
};

const formatPriceInput = (value: string) => {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits).toLocaleString('ko-KR') : '';
};

export function PriceAlertModal({
  isVisible,
  currentPrice,
  changeRate,
  alertPrice,
  onClose,
  onSubmit,
  onReleasePress,
}: PriceAlertModalProps) {
  const isEditing = alertPrice !== null;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PriceAlertForm>({
    resolver: zodResolver(priceAlertSchema),
    defaultValues: { price: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  // 열릴 때마다 설정 가격(없으면 현재가)을 초기값으로 채우고, 취소한 입력값은 남기지 않습니다.
  useEffect(() => {
    if (isVisible) reset({ price: (alertPrice ?? currentPrice).toLocaleString('ko-KR') });
  }, [isVisible, alertPrice, currentPrice, reset]);

  const handleConfirm = () =>
    void handleSubmit(({ price }) => onSubmit(Number(price.replaceAll(',', ''))))();

  return (
    <ProductDetailDialog
      isVisible={isVisible}
      title={isEditing ? '지정가 알림' : '지정가 알림 설정'}
      onClose={onClose}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-grey">
          현재가
        </Text>
        <Text
          className={`pr-3 font-pretendard-bold text-[15px] leading-5 ${getChangeColorClass(changeRate)}`}
        >
          {formatPoint(currentPrice)}
        </Text>
      </View>

      <Text className="mt-4 font-pretendard-bold text-[13px] leading-[18px] text-motu-black">
        설정 가격
      </Text>
      <Controller
        control={control}
        name="price"
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <View
            className={`mt-2 h-[48.5px] flex-row items-center rounded-md border pl-[13px] pr-[11px] ${
              errors.price ? 'border-motu-red' : 'border-motu-grey-lighter'
            }`}
          >
            <TextInput
              ref={ref}
              value={value}
              onChangeText={(text) => onChange(formatPriceInput(text))}
              onBlur={onBlur}
              keyboardType="number-pad"
              accessibilityLabel="설정 가격"
              className="h-full flex-1 py-0 pr-1 text-right font-pretendard-semibold text-[15px] text-motu-black outline-none text-no-font-padding"
            />
            <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-grey">
              P
            </Text>
          </View>
        )}
      />
      <Text
        className={`mt-2 font-pretendard-medium text-[11px] leading-[14px] ${
          errors.price ? 'text-motu-red' : 'text-motu-grey'
        }`}
      >
        {errors.price?.message ?? '설정 가격에 최초 도달 시 1회 알림'}
      </Text>

      <ProductDetailDialogButtons
        secondaryTitle={isEditing ? '알림 해제' : '취소'}
        primaryTitle={isEditing ? '알림 수정' : '알림 설정'}
        onSecondaryPress={isEditing ? onReleasePress : onClose}
        onPrimaryPress={handleConfirm}
      />
    </ProductDetailDialog>
  );
}
