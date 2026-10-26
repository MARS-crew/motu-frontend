import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { LISTING_TRANSACTION_BASES } from '@/constants/listingMetricsPreview';
import type { ListingMetricsForm } from '@/schemas/listingMetricsSchema';
import {
  formatMetricRange,
  getMetricReferenceDate,
  getCompletedMetricPeriod,
  isValidMetricRange,
  type ListingMetricDateRange,
} from '@/utils/listingMetricsDate';

cssInterop(Image, { className: 'style' });

type ListingMetricsBasisFieldProps = {
  value: ListingMetricsForm['transactionBasis'];
  isOpen: boolean;
  disabled?: boolean;
  errorMessage?: string;
  savedBasis?: string | null;
  savedPeriod?: ListingMetricDateRange;
  onToggle: () => void;
  onChange: (value: ListingMetricsForm['transactionBasis']) => void;
};

export function ListingMetricsBasisField({
  value,
  isOpen,
  disabled = false,
  errorMessage,
  savedBasis,
  savedPeriod,
  onToggle,
  onChange,
}: ListingMetricsBasisFieldProps) {
  const [referenceDate] = useState(getMetricReferenceDate);
  const period =
    value === 'lastTwelveMonths'
      ? getCompletedMetricPeriod(referenceDate)
      : value === 'entireOperation' &&
          savedBasis === value &&
          savedPeriod &&
          isValidMetricRange(savedPeriod)
        ? savedPeriod
        : null;
  return (
    <View className={`relative gap-2 ${isOpen ? 'z-30' : 'z-0'}`}>
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
        집계 기준
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="거래액 집계 기준 선택"
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        onPress={onToggle}
        className={`h-[50px] flex-row items-center gap-2 rounded-xl border bg-white px-4 ${errorMessage ? 'border-motu-red' : isOpen ? 'border-motu-black' : 'border-motu-border'}`}
      >
        <Text className="flex-1 font-pretendard-medium text-sm leading-5 text-motu-text-primary">
          {LISTING_TRANSACTION_BASES.find((option) => option.value === value)?.label}
        </Text>
        <Image
          source={require('../../../assets/icons/listingApplication/metrics/chevronDown.svg')}
          className="h-5 w-5"
          contentFit="contain"
        />
      </Pressable>
      <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
        집계 기간 {period ? formatMetricRange(period) : '-'}
      </Text>
      {errorMessage && (
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-xs leading-4 text-motu-red"
        >
          {errorMessage}
        </Text>
      )}
      {isOpen && (
        <View className="absolute left-0 right-0 top-[80px] z-30 rounded-xl border border-motu-grey-lighter bg-white p-1.5 shadow-listing-metrics-panel">
          {LISTING_TRANSACTION_BASES.map((option) => (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: option.value === value }}
              onPress={() => onChange(option.value)}
              className={`flex-row items-center gap-2 rounded-lg p-3 ${option.value === value ? 'bg-motu-option-selected' : ''}`}
            >
              <View className="flex-1 gap-0.5">
                <Text className="font-pretendard-medium text-sm leading-5 text-motu-black">
                  {option.label}
                </Text>
                <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
                  {option.description}
                </Text>
              </View>
              {value === option.value && (
                <Image
                  source={require('../../../assets/icons/listingApplication/metrics/selectedCheck.svg')}
                  className="h-[18px] w-[18px]"
                  contentFit="contain"
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
