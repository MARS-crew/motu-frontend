import { useState } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { View } from 'react-native';

import { TextField } from '@/components/TextField';
import { ListingDateTimeField } from '@/components/listingApplication/ListingDateTimeField';
import { ListingTradingSelectField } from '@/components/listingApplication/ListingTradingSelectField';
import {
  MIN_ORDER_QUANTITIES,
  PRICE_TICK_SIZES,
  type ListingTradingInfoForm,
} from '@/schemas/listingTradingInfoSchema';

type ListingTradingInfoFieldsProps = {
  control: Control<ListingTradingInfoForm>;
  errors: FieldErrors<ListingTradingInfoForm>;
  onFieldLayout: (name: keyof ListingTradingInfoForm, offset: number) => void;
};

export function ListingTradingInfoFields({
  control,
  errors,
  onFieldLayout,
}: ListingTradingInfoFieldsProps) {
  const [focusedNumberField, setFocusedNumberField] = useState<
    'listingPrice' | 'totalQuantity' | null
  >(null);
  const [openField, setOpenField] = useState<
    'minimumOrderQuantity' | 'tickSize' | 'tradingStartAt' | null
  >(null);
  const handleToggle = (name: typeof openField) =>
    setOpenField((current) => (current === name ? null : name));
  return (
    <>
      {(['listingPrice', 'totalQuantity'] as const).map((name) => (
        <View key={name} onLayout={(event) => onFieldLayout(name, event.nativeEvent.layout.y)}>
          <Controller
            control={control}
            name={name}
            render={({ field: { value, onChange, onBlur, ref } }) => (
              <TextField
                label={name === 'listingPrice' ? '희망 상장가' : '총 발행 수량'}
                isRequired
                placeholder="입력해 주세요."
                keyboardType="number-pad"
                value={
                  focusedNumberField === name
                    ? value
                    : value
                      ? `${value}${name === 'listingPrice' ? 'P' : '주'}`
                      : ''
                }
                onChangeText={(text) => onChange(text.replace(/[P주]/g, ''))}
                onBlur={() => {
                  if (/^\d+$/.test(value.replaceAll(',', ''))) {
                    const number = Number(value.replaceAll(',', ''));
                    if (Number.isSafeInteger(number)) onChange(number.toLocaleString('en-US'));
                  }
                  setFocusedNumberField(null);
                  onBlur();
                }}
                onFocus={() => {
                  setFocusedNumberField(name);
                  setOpenField(null);
                }}
                inputRef={ref}
                errorMessage={errors[name]?.message}
                style={{ includeFontPadding: false, textAlignVertical: 'center' }}
              />
            )}
          />
        </View>
      ))}
      {(['minimumOrderQuantity', 'tickSize'] as const).map((name) => (
        <View key={name} onLayout={(event) => onFieldLayout(name, event.nativeEvent.layout.y)}>
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <ListingTradingSelectField
                label={name === 'minimumOrderQuantity' ? '최소 주문 수량' : '호가 단위'}
                value={field.value}
                options={name === 'minimumOrderQuantity' ? MIN_ORDER_QUANTITIES : PRICE_TICK_SIZES}
                unit={name === 'minimumOrderQuantity' ? '주' : 'P'}
                isOpen={openField === name}
                onToggle={() => handleToggle(name)}
                onChange={(value) => {
                  field.onChange(value);
                  setOpenField(null);
                }}
              />
            )}
          />
        </View>
      ))}
      <View onLayout={(event) => onFieldLayout('tradingStartAt', event.nativeEvent.layout.y)}>
        <Controller
          control={control}
          name="tradingStartAt"
          render={({ field }) => (
            <ListingDateTimeField
              value={field.value}
              errorMessage={errors.tradingStartAt?.message}
              isOpen={openField === 'tradingStartAt'}
              onToggle={() => handleToggle('tradingStartAt')}
              onClose={() => setOpenField(null)}
              onChange={field.onChange}
            />
          )}
        />
      </View>
      <View onLayout={(event) => onFieldLayout('priceReason', event.nativeEvent.layout.y)}>
        <Controller
          control={control}
          name="priceReason"
          render={({ field: { value, onChange, onBlur, ref } }) => (
            <TextField
              label="가격 산정 근거"
              isRequired
              multiline
              multilineSize="compact"
              placeholder="최근 매출, 이용자 수, 성장률 등 가격 근거를 입력해 주세요."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              inputRef={ref}
              onFocus={() => setOpenField(null)}
              errorMessage={errors.priceReason?.message}
            />
          )}
        />
      </View>
    </>
  );
}
