import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ListingDatePicker } from '@/components/listingApplication/ListingDatePicker';
import { ListingMonthPicker } from '@/components/listingApplication/ListingMonthPicker';
import { ListingTimePicker } from '@/components/listingApplication/ListingTimePicker';
import { listingTradingInfoSchema } from '@/schemas/listingTradingInfoSchema';

cssInterop(Image, { className: 'style' });

type ListingDateTimeFieldProps = {
  value: string;
  errorMessage?: string;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: () => void;
  onClose: () => void;
  onChange: (value: string) => void;
};

export function ListingDateTimeField({
  value,
  errorMessage,
  isOpen,
  disabled = false,
  onToggle,
  onClose,
  onChange,
}: ListingDateTimeFieldProps) {
  const [todayKey, setTodayKey] = useState(() =>
    new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const hasDate = listingTradingInfoSchema.shape.tradingStartAt.safeParse(value).success;
  const date = hasDate ? value.slice(0, 10).replaceAll('.', '-') : todayKey;
  const time = /^\d{2}:\d{2}$/.test(value.slice(11)) ? value.slice(11) : '09:00';
  const [mode, setMode] = useState<'date' | 'month' | 'time'>('date');
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, 1),
  );
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const handleToggle = () => {
    const nextToday = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    setTodayKey(nextToday);
    const nextDate = hasDate ? date : nextToday;
    setMode('date');
    setVisibleMonth(new Date(Number(nextDate.slice(0, 4)), Number(nextDate.slice(5, 7)) - 1, 1));
    onToggle();
  };
  return (
    <View className="gap-2">
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
        희망 거래 시작일시
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="희망 거래 시작일시 선택"
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        onPress={handleToggle}
        className={`h-[50px] flex-row items-center rounded-xl border bg-white px-4 ${errorMessage ? 'border-motu-btn-red' : isOpen ? 'border-motu-black' : 'border-motu-border'}`}
      >
        <Text className="flex-1 font-pretendard-medium text-sm leading-5 text-motu-text-primary">
          {value}
        </Text>
        <Image
          source={require('../../../assets/icons/listingApplication/trading/calendar.svg')}
          className="h-5 w-5"
          contentFit="contain"
        />
      </Pressable>
      {isOpen && mode === 'date' && (
        <ListingDatePicker
          value={date}
          year={year}
          month={month}
          today={todayKey}
          onMonthChange={(offset) => setVisibleMonth(new Date(year, month + offset, 1))}
          onMonthPress={() => setMode('month')}
          onTimePress={() => setMode('time')}
          onChange={(nextDate) => onChange(`${nextDate.replaceAll('-', '.')} ${time}`)}
        />
      )}
      {isOpen && mode === 'month' && (
        <ListingMonthPicker
          year={year}
          selectedYear={Number(date.slice(0, 4))}
          selectedMonth={Number(date.slice(5, 7)) - 1}
          onYearChange={(offset) => setVisibleMonth(new Date(year + offset, month, 1))}
          onChange={(nextMonth) => {
            setVisibleMonth(new Date(year, nextMonth, 1));
            setMode('date');
          }}
          onTimePress={() => setMode('time')}
        />
      )}
      {isOpen && mode === 'time' && (
        <ListingTimePicker
          date={date}
          value={time}
          onBack={() => setMode('date')}
          onApply={(time) => {
            onChange(`${date.replaceAll('-', '.')} ${time}`);
            onClose();
          }}
        />
      )}
      {errorMessage && (
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-xs leading-4 text-motu-btn-red"
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
}
