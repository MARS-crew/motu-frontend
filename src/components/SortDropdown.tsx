import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type SortOption = {
  label: string;
  value: string;
};

type SortDropdownProps = {
  options: SortOption[];
  value: string;
  onValueChange: (value: string) => void;
};

cssInterop(Image, { className: 'style' });

export function SortDropdown({ options, value, onValueChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  if (!selectedOption) return null;

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View className="relative z-10 items-end">
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        accessibilityLabel="정렬 기준 선택"
        onPress={() => setIsOpen((previousIsOpen) => !previousIsOpen)}
        className="h-[42px] flex-row items-center gap-1.5 rounded-lg border border-motu-grey-lighter bg-white px-[15px]"
      >
        <Text className="font-inter-medium text-[13px] leading-5 text-motu-black">
          {selectedOption.label}
        </Text>
        <Image
          source={require('../../assets/icons/sort/chevronDown.svg')}
          contentFit="contain"
          className={`h-4 w-4 ${isOpen ? '' : 'rotate-180'}`}
        />
      </Pressable>

      {isOpen && (
        <View className="absolute right-0 top-[50px] w-36 overflow-hidden rounded-xl border border-motu-grey-lighter bg-white py-[5px]">
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
                  className={`font-inter-medium text-xs leading-4 ${
                    isSelected ? 'text-motu-black' : 'text-motu-grey'
                  }`}
                >
                  {option.label}
                </Text>
                {isSelected && (
                  <Text className="font-inter-medium text-xs leading-4 text-motu-black">✓</Text>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
