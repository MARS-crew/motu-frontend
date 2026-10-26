import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

type ListingTradingSelectFieldProps = {
  label: string;
  value: string;
  options: readonly string[];
  unit: string;
  isOpen: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onToggle: () => void;
  onChange: (value: string) => void;
};

export function ListingTradingSelectField({
  label,
  value,
  options,
  unit,
  isOpen,
  disabled = false,
  errorMessage,
  onToggle,
  onChange,
}: ListingTradingSelectFieldProps) {
  return (
    <View className="gap-2">
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} 선택`}
        accessibilityState={{ expanded: isOpen, disabled }}
        disabled={disabled}
        onPress={onToggle}
        className={`h-[50px] flex-row items-center rounded-xl border bg-white px-4 ${errorMessage ? 'border-motu-btn-red' : isOpen ? 'border-motu-black' : 'border-motu-border'}`}
      >
        <Text className="flex-1 font-pretendard-medium text-sm leading-5 text-motu-text-primary">
          {value}
          {unit}
        </Text>
        <View className="h-5 w-5 items-center justify-center">
          <Image
            source={require('../../../assets/icons/listingApplication/trading/chevronDown.svg')}
            className="h-[18px] w-[18px]"
            contentFit="contain"
          />
        </View>
      </Pressable>
      {errorMessage && (
        <Text
          accessibilityLiveRegion="polite"
          className="font-pretendard-medium text-xs leading-4 text-motu-btn-red"
        >
          {errorMessage}
        </Text>
      )}
      {isOpen && (
        <View className="rounded-xl border border-motu-grey-lighter bg-white p-1.5 shadow-listing-panel">
          {options.map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected: option === value }}
              onPress={() => onChange(option)}
              className={`h-11 flex-row items-center gap-2 rounded-lg px-3 ${option === value ? 'bg-motu-option-selected' : ''}`}
            >
              <Text className="flex-1 font-pretendard-medium text-sm leading-5 text-motu-black">
                {option}
                {unit}
              </Text>
              {option === value && (
                <Image
                  source={require('../../../assets/icons/listingApplication/form/selectedCheck.svg')}
                  className="h-[18px] w-[18px]"
                  contentFit="contain"
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
