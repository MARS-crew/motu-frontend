import { useState } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { Text, View } from 'react-native';

import { TextField } from '@/components/TextField';
import { ListingMetricsBasisField } from '@/components/listingApplication/ListingMetricsBasisField';
import { ListingMetricsDateField } from '@/components/listingApplication/ListingMetricsDateField';
import { ListingMetricsNumberField } from '@/components/listingApplication/ListingMetricsNumberField';
import type { ListingMetricDateRange } from '@/utils/listingMetricsDate';
import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';

type ListingMetricsFieldsProps = {
  control: Control<ListingMetricsForm>;
  errors: FieldErrors<ListingMetricsForm>;
  isSaving?: boolean;
  savedTransactionBasis?: string | null;
  savedTransactionPeriod?: ListingMetricDateRange;
  onHelpPress: (type: 'terms' | 'criteria') => void;
  onFieldLayout: (field: keyof ListingMetricsForm, offset: number) => void;
  onPopoverChange: (isOpen: boolean) => void;
};

type MetricsPopoverField =
  'revenuePeriod' | 'revenueExtractedAt' | 'transactionExtractedAt' | 'transactionBasis';

export function ListingMetricsFields({
  control,
  errors,
  isSaving = false,
  savedTransactionBasis,
  savedTransactionPeriod,
  onHelpPress,
  onFieldLayout,
  onPopoverChange,
}: ListingMetricsFieldsProps) {
  const [openField, setOpenField] = useState<MetricsPopoverField | null>(null);
  const handleClose = () => {
    setOpenField(null);
    onPopoverChange(false);
  };
  const handleToggle = (field: MetricsPopoverField) => {
    const nextField = openField === field ? null : field;
    setOpenField(nextField);
    onPopoverChange(nextField !== null);
  };
  const renderNumber = (
    name: 'mau' | 'dau' | 'annualRevenue' | 'transactionAmount',
    label: string,
    helpType?: 'terms' | 'criteria',
  ) => (
    <View onLayout={(event) => onFieldLayout(name, event.nativeEvent.layout.y)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <ListingMetricsNumberField
            label={label}
            value={field.value}
            disabled={isSaving}
            isCurrency={name === 'annualRevenue' || name === 'transactionAmount'}
            onChange={field.onChange}
            onBlur={field.onBlur}
            onFocus={handleClose}
            errorMessage={errors[name]?.message}
            onHelpPress={
              helpType
                ? () => {
                    handleClose();
                    onHelpPress(helpType);
                  }
                : undefined
            }
          />
        )}
      />
    </View>
  );
  const renderSource = (name: 'revenueSource' | 'transactionSource') => (
    <View onLayout={(event) => onFieldLayout(name, event.nativeEvent.layout.y)}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <TextField
            label="출처명"
            accessibilityLabel={name === 'revenueSource' ? '매출 출처명' : '거래액 출처명'}
            placeholder="입력해 주세요."
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
            onFocus={handleClose}
            editable={!isSaving}
            errorMessage={errors[name]?.message}
            hasBaselineOffset={false}
          />
        )}
      />
    </View>
  );
  const renderExtractedDate = (name: 'revenueExtractedAt' | 'transactionExtractedAt') => (
    <View
      className={openField === name ? 'z-30' : 'z-0'}
      onLayout={(event) => onFieldLayout(name, event.nativeEvent.layout.y)}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <ListingMetricsDateField
            label="추출일"
            accessibilityLabel={
              name === 'revenueExtractedAt' ? '매출 추출일 선택' : '거래액 추출일 선택'
            }
            value={{ start: field.value, end: field.value }}
            disabled={isSaving}
            isOpen={!isSaving && openField === name}
            onToggle={() => handleToggle(name)}
            onClose={handleClose}
            onChange={(range) => field.onChange(range.start)}
            errorMessage={errors[name]?.message}
          />
        )}
      />
    </View>
  );
  return (
    <>
      {renderNumber('mau', 'MAU', 'terms')}
      {renderNumber('dau', 'DAU', 'terms')}
      <Text
        accessibilityRole="header"
        className="pt-2 font-pretendard-bold text-[15px] leading-5 text-motu-black"
      >
        매출
      </Text>
      {renderNumber('annualRevenue', '연간 매출', 'criteria')}
      <View
        className={openField === 'revenuePeriod' ? 'z-30' : 'z-0'}
        onLayout={(event) => onFieldLayout('revenuePeriod', event.nativeEvent.layout.y)}
      >
        <Controller
          control={control}
          name="revenuePeriod"
          render={({ field }) => (
            <ListingMetricsDateField
              label="매출 집계 기간"
              accessibilityLabel="매출 집계 기간 선택"
              value={field.value}
              isRange
              disabled={isSaving}
              isOpen={!isSaving && openField === 'revenuePeriod'}
              onToggle={() => handleToggle('revenuePeriod')}
              onClose={handleClose}
              onChange={field.onChange}
              errorMessage={
                errors.revenuePeriod?.message ||
                errors.revenuePeriod?.start?.message ||
                errors.revenuePeriod?.end?.message
              }
            />
          )}
        />
      </View>
      {renderSource('revenueSource')}
      {renderExtractedDate('revenueExtractedAt')}
      <Text
        accessibilityRole="header"
        className="pt-2 font-pretendard-bold text-[15px] leading-5 text-motu-black"
      >
        거래액
      </Text>
      {renderNumber('transactionAmount', '거래액')}
      <View
        className={openField === 'transactionBasis' ? 'z-30' : 'z-0'}
        onLayout={(event) => onFieldLayout('transactionBasis', event.nativeEvent.layout.y)}
      >
        <Controller
          control={control}
          name="transactionBasis"
          render={({ field }) => (
            <ListingMetricsBasisField
              value={field.value}
              savedBasis={savedTransactionBasis}
              savedPeriod={savedTransactionPeriod}
              disabled={isSaving}
              errorMessage={errors.transactionBasis?.message}
              isOpen={!isSaving && openField === 'transactionBasis'}
              onToggle={() => handleToggle('transactionBasis')}
              onChange={(value) => {
                field.onChange(value);
                handleClose();
              }}
            />
          )}
        />
      </View>
      {renderSource('transactionSource')}
      {renderExtractedDate('transactionExtractedAt')}
    </>
  );
}
