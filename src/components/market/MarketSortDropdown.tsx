import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type MarketSortDropdownProps<T extends string> = {
  options: { label: string; value: T }[];
  value: T;
  onValueChange: (value: T) => void;
  // 포트폴리오처럼 버튼이 오른쪽에 있으면 메뉴도 오른쪽 기준으로 펼칩니다.
  align?: 'left' | 'right';
};

// 메뉴는 공용 SortDropdown과 같은 모양이고, 버튼만 마켓 디자인(테두리 없는 텍스트, 왼쪽 정렬)을 따릅니다.
export function MarketSortDropdown<T extends string>({
  options,
  value,
  onValueChange,
  align = 'left',
}: MarketSortDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  if (!selectedOption) return null;

  const handleSelect = (optionValue: T) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className={`relative z-10 ${align === 'right' ? 'items-end' : 'items-start'}`}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel={`정렬 기준, ${selectedOption.label}`}
        onPress={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
        hitSlop={8}
        className="flex-row items-center gap-1"
      >
        <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black">
          {selectedOption.label}
        </Text>
        <Image
          source={require('../../../assets/icons/market/chevronDown.svg')}
          contentFit="contain"
          className={`h-[15px] w-[15px] ${isOpen ? 'rotate-180' : ''}`}
        />
      </Pressable>

      {isOpen && (
        <View
          className={`absolute top-8 w-36 ${align === 'right' ? 'right-0' : 'left-0'} overflow-hidden rounded-xl border border-motu-grey-lighter bg-white py-[5px]`}
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleSelect(option.value)}
                className="h-8 flex-row items-center justify-between px-3"
              >
                <Text
                  className={`font-pretendard-medium text-xs leading-4 ${
                    isSelected ? 'text-motu-black' : 'text-motu-grey'
                  }`}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
                    ✓
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
