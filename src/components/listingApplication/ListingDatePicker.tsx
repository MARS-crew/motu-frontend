import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import { getCalendarWeeks, toDateKey } from '@/utils/transactionDate';

cssInterop(Image, { className: 'style' });

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

type ListingDatePickerProps = {
  value: string;
  year: number;
  month: number;
  today: string;
  onMonthChange: (offset: number) => void;
  onMonthPress: () => void;
  onTimePress: () => void;
  onChange: (date: string) => void;
};

export function ListingDatePicker({
  value,
  year,
  month,
  today,
  onMonthChange,
  onMonthPress,
  onTimePress,
  onChange,
}: ListingDatePickerProps) {
  return (
    <View className="shadow-listing-panel gap-[14px] rounded-xl border border-motu-grey-lighter bg-white p-4">
      <View className="flex-row items-center gap-2">
        <Text
          accessibilityRole="header"
          className="flex-1 font-pretendard-bold text-base leading-[22px] text-motu-text-primary"
        >
          날짜 선택
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={onTimePress}
          className="flex-row items-center gap-0.5"
          hitSlop={8}
        >
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-text-secondary">
            시간 선택
          </Text>
          <View className="h-4 w-4 items-center justify-center">
            <Image
              source={require('../../../assets/icons/listingApplication/trading/chevronRight.svg')}
              className="h-[18px] w-[18px]"
              contentFit="contain"
            />
          </View>
        </Pressable>
      </View>
      <View className="gap-2">
        <View className="h-6 flex-row items-center justify-center gap-4 pb-1">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="이전 달"
            onPress={() => onMonthChange(-1)}
            hitSlop={8}
          >
            <Image
              source={require('../../../assets/icons/listingApplication/trading/chevronLeft.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="월 선택 열기"
            onPress={onMonthPress}
            hitSlop={8}
          >
            <Text className="font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
              {year}.{String(month + 1).padStart(2, '0')}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 달"
            onPress={() => onMonthChange(1)}
            hitSlop={8}
            className="h-6 w-5 items-center justify-center"
          >
            <Image
              source={require('../../../assets/icons/listingApplication/trading/chevronRight.svg')}
              className="h-[18px] w-[18px]"
              contentFit="contain"
            />
          </Pressable>
        </View>
        <View className="flex-row">
          {WEEKDAYS.map((day, index) => (
            <View key={day} className="h-6 flex-1 items-center justify-center">
              <Text
                className={`font-pretendard-medium text-xs leading-4 ${index === 0 ? 'text-motu-btn-red' : index === 6 ? 'text-motu-calendar-blue' : 'text-motu-text-tertiary'}`}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        {getCalendarWeeks(year, month).map((week, index) => (
          <View key={index} className="flex-row">
            {week.map((day, weekday) => {
              if (day === null) return <View key={weekday} className="h-10 flex-1" />;
              const date = toDateKey(year, month, day);
              const isSelected = date === value;
              const isDisabled = date < today;
              return (
                <View key={weekday} className="h-10 flex-1 items-center justify-center">
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={date}
                    accessibilityState={{ selected: isSelected, disabled: isDisabled }}
                    disabled={isDisabled}
                    onPress={() => onChange(date)}
                    className={`h-9 w-9 items-center justify-center rounded-full ${isSelected ? 'bg-motu-black' : date === today ? 'border border-motu-border' : ''}`}
                  >
                    <Text
                      className={`text-sm ${isSelected ? 'font-pretendard-bold leading-[18px] text-white' : `font-pretendard-medium leading-5 ${isDisabled ? 'text-motu-disabled' : weekday === 0 ? 'text-motu-btn-red' : weekday === 6 ? 'text-motu-calendar-blue' : 'text-motu-text-primary'}`}`}
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
    </View>
  );
}
