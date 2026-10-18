import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Button } from '@/components/Button';

cssInterop(Image, { className: 'style' });

type ListingTimePickerProps = {
  date: string;
  value: string;
  onBack: () => void;
  onApply: (time: string) => void;
};

export function ListingTimePicker({ date, value, onBack, onApply }: ListingTimePickerProps) {
  const [hour, setHour] = useState(value.slice(0, 2));
  const [minute, setMinute] = useState(value.slice(3, 5));
  const hasMinuteError = !/^\d{1,2}$/.test(minute) || Number(minute) > 59;
  const handleApply = () => {
    if (!hasMinuteError) onApply(`${hour}:${minute.padStart(2, '0')}`);
  };
  return (
    <View className="shadow-listing-panel gap-[14px] rounded-xl border border-motu-grey-lighter bg-white p-4">
      <View className="flex-row items-center gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="날짜 선택으로 돌아가기"
          onPress={onBack}
          hitSlop={8}
        >
          <Image
            source={require('../../../assets/icons/listingApplication/form/backArrow.svg')}
            className="h-6 w-6"
            contentFit="contain"
          />
        </Pressable>
        <Text
          accessibilityRole="header"
          className="font-pretendard-bold text-base leading-[22px] text-motu-text-primary"
        >
          시간 선택
        </Text>
      </View>
      <View className="gap-3">
        <View className="bg-motu-bg-secondary flex-row items-center gap-2 rounded-[10px] px-[14px] py-3">
          <Text className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
            선택 날짜
          </Text>
          <Text className="font-pretendard-bold text-[15px] leading-5 text-motu-text-primary">
            {date.replaceAll('-', '.')}
          </Text>
        </View>
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
          시간
        </Text>
        <View className="gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <View key={row} className="flex-row gap-1.5">
              {[0, 1, 2, 3].map((column) => {
                const time = String(row * 4 + column).padStart(2, '0');
                const isSelected = time === hour;
                return (
                  <Pressable
                    key={time}
                    accessibilityRole="button"
                    accessibilityLabel={`${time}시`}
                    accessibilityState={{ selected: isSelected }}
                    onPress={() => setHour(time)}
                    className={`h-9 flex-1 items-center justify-center rounded-[10px] ${isSelected ? 'bg-motu-black' : 'border border-motu-border bg-white'}`}
                  >
                    <Text
                      className={`text-[13px] leading-[18px] ${isSelected ? 'font-pretendard-bold text-white' : 'font-pretendard-medium text-motu-text-primary'}`}
                    >
                      {time}시
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
        <View className="flex-row items-center gap-1">
          <Text className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
            분
          </Text>
          <Text className="text-motu-text-tertiary font-pretendard-medium text-[11px] leading-[14px]">
            기준 시간대: KST
          </Text>
        </View>
        <View
          className={`h-[50px] flex-row items-center gap-2 rounded-xl border-[1.5px] px-4 ${hasMinuteError ? 'border-motu-btn-red' : 'border-motu-black'}`}
        >
          <TextInput
            accessibilityLabel="분 입력"
            value={minute}
            onChangeText={setMinute}
            keyboardType="number-pad"
            maxLength={2}
            className="h-full flex-1 py-0 font-pretendard-medium text-sm leading-5 text-motu-text-primary outline-none"
          />
          <Text className="text-motu-text-tertiary font-pretendard-medium text-sm leading-5">
            분
          </Text>
        </View>
        {hasMinuteError && (
          <Text
            accessibilityLiveRegion="polite"
            className="font-pretendard-medium text-xs leading-4 text-motu-btn-red"
          >
            분은 00~59 사이로 입력해 주세요.
          </Text>
        )}
      </View>
      <View className="bg-motu-bg-secondary rounded-[10px] px-[14px] py-3">
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
          입력한 날짜와 시간은 희망값이며 관리자 심사 후 변경될 수 있습니다.
        </Text>
      </View>
      <Button title="완료" size="md" onPress={handleApply} disabled={hasMinuteError} />
    </View>
  );
}
