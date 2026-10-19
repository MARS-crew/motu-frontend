import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import {
  getMetricRangeLastDate,
  isValidMetricRange,
  type ListingMetricDateRange,
} from '@/utils/listingMetricsDate';
import { getCalendarWeeks, toDateKey } from '@/utils/transactionDate';

cssInterop(Image, { className: 'style' });

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type ListingMetricsCalendarProps = {
  title: string;
  description: string;
  value: ListingMetricDateRange;
  isRange?: boolean;
  onCancel: () => void;
  onApply: (range: ListingMetricDateRange) => void;
};

export function ListingMetricsCalendar({
  title,
  description,
  value,
  isRange = false,
  onCancel,
  onApply,
}: ListingMetricsCalendarProps) {
  const [range, setRange] = useState(value);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(Number(value.start.slice(0, 4)), Number(value.start.slice(5, 7)) - 1, 1),
  );
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const handleDayPress = (date: string) => {
    if (!isRange) {
      setRange({ start: date, end: date });
      return;
    }
    if (!isSelectingEnd || date < range.start) {
      setRange({ start: date, end: '' });
      setIsSelectingEnd(true);
    } else {
      setRange({ start: range.start, end: date });
      setIsSelectingEnd(false);
    }
  };
  return (
    <View className="gap-3 rounded-xl border border-motu-grey-lighter bg-white p-4 shadow-listing-metrics-panel">
      <View className="gap-1">
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-[15px] leading-5 text-motu-black"
        >
          {title}
        </Text>
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey"
        >
          {isRange && isSelectingEnd ? '종료일을 선택해 주세요. (최대 12개월)' : description}
        </Text>
      </View>
      <View className="gap-1">
        <View className="h-[26px] flex-row items-center justify-center gap-3 pb-1.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이전 달"
            onPress={() => setVisibleMonth(new Date(year, month - 1, 1))}
            hitSlop={8}
          >
            <Image
              source={require('../../../assets/icons/listingApplication/metrics/chevronLeft.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
          </Pressable>
          <Text className="font-pretendard-bold text-[15px] leading-5 text-motu-black">
            {year}.{String(month + 1).padStart(2, '0')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 달"
            onPress={() => setVisibleMonth(new Date(year, month + 1, 1))}
            hitSlop={8}
            className="h-6 w-5 items-center justify-center"
          >
            <Image
              source={require('../../../assets/icons/listingApplication/metrics/chevronRight.svg')}
              className="h-[18px] w-[18px]"
              contentFit="contain"
            />
          </Pressable>
        </View>
        <View className="flex-row">
          {WEEKDAYS.map((day, index) => (
            <View key={day} className="h-[26px] flex-1 items-center justify-center">
              <Text
                className={`font-pretendard-medium text-[11px] leading-[14px] ${index === 0 ? 'text-motu-red' : index === 6 ? 'text-motu-blue' : 'text-motu-grey'}`}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        {getCalendarWeeks(year, month).map((week, index) => (
          <View key={index} className="flex-row">
            {week.map((day, weekday) => {
              if (day === null) return <View key={weekday} className="h-[38px] flex-1" />;
              const date = toDateKey(year, month, day);
              const isEndpoint = date === range.start || date === range.end;
              const isInRange = isRange && !!range.end && date >= range.start && date <= range.end;
              const isDisabled =
                isRange && isSelectingEnd && date > getMetricRangeLastDate(range.start);
              const isRowStart = weekday === 0 || !week[weekday - 1] || date === range.start;
              const isRowEnd = weekday === 6 || !week[weekday + 1] || date === range.end;
              return (
                <View
                  key={weekday}
                  className={`h-[38px] flex-1 items-center justify-center ${isInRange ? `bg-motu-option-selected ${isRowStart ? 'rounded-l-[19px]' : ''} ${isRowEnd ? 'rounded-r-[19px]' : ''}` : ''}`}
                >
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={date}
                    accessibilityState={{ selected: isEndpoint || isInRange, disabled: isDisabled }}
                    disabled={isDisabled}
                    onPress={() => handleDayPress(date)}
                    className={`h-[34px] w-[34px] items-center justify-center rounded-full ${isEndpoint ? 'bg-motu-black' : ''}`}
                  >
                    <Text
                      className={`font-pretendard-medium text-sm leading-5 ${isEndpoint ? 'text-white' : isDisabled ? 'text-motu-disabled' : weekday === 0 ? 'text-motu-red' : weekday === 6 ? 'text-motu-blue' : 'text-motu-black'}`}
                    >
                      {day}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View className="flex-row gap-2">
        <View className="flex-1">
          <Button title="취소" size="md" variant="secondary" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button
            title="적용"
            size="md"
            disabled={!isValidMetricRange(range)}
            onPress={() => onApply(range)}
          />
        </View>
      </View>
    </View>
  );
}
