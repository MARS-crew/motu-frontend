import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Text, Pressable, View } from 'react-native';

import { ListingMetricsCalendar } from '@/components/listingApplication/ListingMetricsCalendar';
import {
  getMetricReferenceDate,
  isValidMetricDate,
  isValidMetricRange,
  formatMetricDate,
  formatMetricRange,
  type ListingMetricDateRange,
} from '@/utils/listingMetricsDate';

cssInterop(Image, { className: 'style' });

type ListingMetricsDateFieldProps = {
  label: string;
  accessibilityLabel: string;
  value: ListingMetricDateRange;
  isRange?: boolean;
  isOpen: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onToggle: () => void;
  onClose: () => void;
  onChange: (value: ListingMetricDateRange) => void;
};

export function ListingMetricsDateField({
  label,
  accessibilityLabel,
  value,
  isRange = false,
  isOpen,
  disabled = false,
  errorMessage,
  onToggle,
  onClose,
  onChange,
}: ListingMetricsDateFieldProps) {
  const [referenceDate, setReferenceDate] = useState(getMetricReferenceDate);
  const hasValue = !!value.start && (!isRange || !!value.end);
  const hasValidValue = isRange ? isValidMetricRange(value) : isValidMetricDate(value.start);
  const calendarValue = hasValidValue ? value : { start: referenceDate, end: referenceDate };
  return (
    <View className={`relative gap-2 ${isOpen ? 'z-30' : 'z-0'}`}>
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        onPress={() => {
          setReferenceDate(getMetricReferenceDate());
          onToggle();
        }}
        className={`h-[50px] flex-row items-center gap-2 rounded-xl border bg-white px-4 ${errorMessage ? 'border-motu-red' : isOpen ? 'border-motu-black' : 'border-motu-border'}`}
      >
        <Text
          numberOfLines={1}
          className={`flex-1 font-pretendard-medium text-sm leading-5 ${hasValue ? 'text-motu-text-primary' : 'text-motu-grey-light'}`}
        >
          {hasValue
            ? isRange
              ? formatMetricRange(value)
              : formatMetricDate(value.start)
            : isRange
              ? '시작일 ~ 종료일을 선택해 주세요.'
              : '날짜를 선택해 주세요.'}
        </Text>
        <Image
          source={require('../../../assets/icons/listingApplication/metrics/calendar.svg')}
          className="h-5 w-5"
          contentFit="contain"
        />
      </Pressable>
      {errorMessage && (
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-red">
          {errorMessage}
        </Text>
      )}
      {isOpen && (
        <View className="absolute left-0 right-0 top-[80px] z-30">
          <ListingMetricsCalendar
            title={isRange ? '연간 매출 집계 기간 선택' : '추출일 선택'}
            description={
              isRange
                ? '시작일 선택 후 종료일을 선택합니다.'
                : '리포트를 조회하거나 내려받은 날짜를 선택합니다.'
            }
            value={calendarValue}
            isRange={isRange}
            onCancel={onClose}
            onApply={(range) => {
              onChange(range);
              onClose();
            }}
          />
        </View>
      )}
    </View>
  );
}
