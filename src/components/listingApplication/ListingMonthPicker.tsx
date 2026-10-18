import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type ListingMonthPickerProps = {
  year: number;
  selectedYear: number;
  selectedMonth: number;
  onYearChange: (offset: number) => void;
  onChange: (month: number) => void;
  onTimePress: () => void;
};

export function ListingMonthPicker({
  year,
  selectedYear,
  selectedMonth,
  onYearChange,
  onChange,
  onTimePress,
}: ListingMonthPickerProps) {
  return (
    <View className="shadow-listing-panel gap-[14px] rounded-xl border border-motu-grey-lighter bg-white p-4">
      <View className="flex-row items-center gap-2">
        <Text
          accessibilityRole="header"
          className="flex-1 font-pretendard-bold text-base leading-[22px] text-motu-text-primary"
        >
          월 선택
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
            accessibilityLabel="이전 연도"
            onPress={() => onYearChange(-1)}
            hitSlop={8}
          >
            <Image
              source={require('../../../assets/icons/listingApplication/trading/chevronLeft.svg')}
              className="h-6 w-6"
              contentFit="contain"
            />
          </Pressable>
          <Text className="font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
            {year}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="다음 연도"
            onPress={() => onYearChange(1)}
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
        <View className="gap-[7px]">
          {[0, 1, 2].map((row) => (
            <View key={row} className="flex-row gap-[7px]">
              {[0, 1, 2, 3].map((column) => {
                const month = row * 4 + column;
                const isSelected = year === selectedYear && month === selectedMonth;
                return (
                  <Pressable
                    key={month}
                    accessibilityRole="button"
                    accessibilityLabel={`${year}년 ${month + 1}월`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => onChange(month)}
                    className={`h-11 flex-1 items-center justify-center rounded-[10px] ${isSelected ? 'bg-motu-black' : 'border border-motu-grey-lighter bg-white'}`}
                  >
                    <Text
                      className={`font-pretendard-medium text-sm leading-5 ${isSelected ? 'text-white' : 'text-motu-black'}`}
                    >
                      {month + 1}월
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
