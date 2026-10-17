import { Pressable, Text } from 'react-native';

type CategoryChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
};

export function CategoryChip({ label, isSelected, onPress }: CategoryChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      className={`h-8 items-center justify-center rounded-full px-3.5 ${
        isSelected ? 'bg-motu-black' : 'bg-motu-grey-chip'
      }`}
    >
      <Text
        className={`text-[13px] leading-8 ${
          isSelected
            ? 'font-pretendard-semibold text-white'
            : 'font-pretendard-medium text-motu-grey'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
