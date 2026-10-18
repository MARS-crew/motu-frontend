import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Fragment, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { getCalendarWeeks, toDateKey, type TransactionDateRange } from '@/utils/transactionDate';

cssInterop(Image, { className: 'style' });

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type TransactionDatePickerProps = {
  value: TransactionDateRange;
  onApply: (range: TransactionDateRange) => void;
};

export function TransactionDatePicker({ value, onApply }: TransactionDatePickerProps) {
  const [range, setRange] = useState(value);
  const [activeField, setActiveField] = useState<'start' | 'end'>('start');
  const [month, setMonth] = useState(
    () => new Date(Number(value.start.slice(0, 4)), Number(value.start.slice(5, 7)) - 1, 1),
  );
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const weeks = getCalendarWeeks(year, monthIndex);

  const handleMonthChange = (offset: number) => setMonth(new Date(year, monthIndex + offset, 1));
  const handleFieldPress = (field: 'start' | 'end') => {
    setActiveField(field);
    const date = range[field];
    setMonth(new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, 1));
  };
  const handleDayPress = (day: number) => {
    const date = toDateKey(year, monthIndex, day);
    if (activeField === 'start') {
      setRange({ start: date, end: date > range.end ? date : range.end });
      setActiveField('end');
    } else {
      setRange(date < range.start ? { start: date, end: range.start } : { ...range, end: date });
    }
  };

  return (
    <View className="rounded-xl border border-motu-grey-lighter bg-white p-4">
      <View className="flex-row items-center justify-between gap-2">
        <Text className="font-pretendard-bold text-[13px] text-motu-black">조회 기간</Text>
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-semibold text-[11px] text-motu-grey"
        >
          {activeField === 'start' ? '시작일을 선택하세요' : '종료일을 선택하세요'}
        </Text>
      </View>
      <View className="my-3 flex-row items-center gap-2">
        {(['start', 'end'] as const).map((field, index) => (
          <Fragment key={field}>
            {index === 1 && <Text className="text-motu-grey">~</Text>}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${field === 'start' ? '시작일' : '종료일'} ${range[field]}`}
              accessibilityState={{ selected: activeField === field }}
              onPress={() => handleFieldPress(field)}
              className={`h-11 flex-1 flex-row items-center justify-between rounded-lg border px-[13px] ${activeField === field ? 'border-motu-black bg-motu-bg' : 'border-motu-grey-lighter'}`}
            >
              <Text className="font-pretendard-semibold text-xs text-motu-black">
                {range[field].replaceAll('-', '.')}
              </Text>
              <Image
                source={require('../../../assets/icons/transaction/calendarGray.svg')}
                className="h-4 w-4"
                contentFit="contain"
              />
            </Pressable>
          </Fragment>
        ))}
      </View>
      <View className="rounded-xl border border-motu-grey-lighter px-[14px] pb-2 pt-[14px]">
        <View className="mb-2 flex-row items-center justify-between">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이전 달"
            onPress={() => handleMonthChange(-1)}
            className="h-11 w-11 items-center justify-center"
          >
            <Image
              source={require('../../../assets/icons/pagination/chevronRight.svg')}
              className="h-4 w-4 rotate-180"
              contentFit="contain"
            />
          </Pressable>
          <Text accessibilityRole="header" className="font-pretendard-bold text-sm text-motu-black">
            {year}.{String(monthIndex + 1).padStart(2, '0')}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 달"
            onPress={() => handleMonthChange(1)}
            className="h-11 w-11 items-center justify-center"
          >
            <Image
              source={require('../../../assets/icons/pagination/chevronRight.svg')}
              className="h-4 w-4"
              contentFit="contain"
            />
          </Pressable>
        </View>
        <View className="flex-row">
          {WEEKDAYS.map((day, index) => (
            <Text
              key={day}
              className={`flex-1 pb-2 text-center font-pretendard text-[11px] ${index === 0 ? 'text-motu-red' : index === 6 ? 'text-motu-blue' : 'text-motu-grey'}`}
            >
              {day}
            </Text>
          ))}
        </View>
        {weeks.map((week, index) => (
          <View key={index} className="flex-row">
            {week.map((day, weekday) => {
              if (day === null) return <View key={weekday} className="h-9 w-[14.285714%]" />;
              const date = toDateKey(year, monthIndex, day);
              const isEndpoint = date === range.start || date === range.end;
              const isInRange = date >= range.start && date <= range.end;
              return (
                <View
                  key={weekday}
                  className="relative h-9 w-[14.285714%] items-center justify-center"
                >
                  {isInRange && range.start !== range.end && (
                    <View
                      pointerEvents="none"
                      className={`absolute bottom-0 top-0 bg-motu-grey-lighter ${
                        date === range.start
                          ? 'right-0 w-1/2'
                          : date === range.end
                            ? 'left-0 w-1/2'
                            : 'left-0 right-0'
                      }`}
                    />
                  )}
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={date}
                    accessibilityState={{ selected: isInRange }}
                    onPress={() => handleDayPress(day)}
                    className={`h-9 w-9 items-center justify-center rounded-full ${isEndpoint ? 'bg-motu-black' : ''}`}
                  >
                    <Text
                      className={`font-pretendard-medium text-xs ${isEndpoint ? 'text-white' : 'text-motu-black'}`}
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
      <View className="mt-4">
        <Button title="조회하기" size="lg" onPress={() => onApply(range)} />
      </View>
    </View>
  );
}
