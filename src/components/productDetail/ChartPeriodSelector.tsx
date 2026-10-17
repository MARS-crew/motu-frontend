import { Pressable, Text, View } from 'react-native';

import type { ChartPeriod } from '@/types/product';

type ChartPeriodSelectorProps = {
  options: { label: string; value: ChartPeriod }[];
  value: ChartPeriod;
  onValueChange: (value: ChartPeriod) => void;
};

export function ChartPeriodSelector({ options, value, onValueChange }: ChartPeriodSelectorProps) {
  return (
    <View className="h-[38px] flex-row rounded-xl bg-motu-grey-lighter/50 p-1">
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <Pressable
            key={option.value}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            onPress={() => onValueChange(option.value)}
            className={`h-[30px] flex-1 items-center justify-center rounded-lg pt-px ${
              isSelected ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`font-pretendard-medium text-xs leading-4 ${
                isSelected ? 'text-motu-black' : 'text-motu-grey'
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
