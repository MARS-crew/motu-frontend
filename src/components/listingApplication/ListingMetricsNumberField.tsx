import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { TextField } from '@/components/TextField';

type ListingMetricsNumberFieldProps = {
  label: string;
  value: string;
  isCurrency?: boolean;
  disabled?: boolean;
  errorMessage?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  onFocus: () => void;
  onHelpPress?: () => void;
};

export function ListingMetricsNumberField({
  label,
  value,
  isCurrency = false,
  disabled = false,
  errorMessage,
  onChange,
  onBlur,
  onFocus,
  onHelpPress,
}: ListingMetricsNumberFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const handleBlur = () => {
    const number = Number(value.replaceAll(',', ''));
    if (value && /^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(value) && Number.isSafeInteger(number))
      onChange(number.toLocaleString('en-US'));
    setIsFocused(false);
    onBlur();
  };
  return (
    <TextField
      label={label}
      accessibilityLabel={label}
      value={value && isCurrency && !isFocused ? `${value} ₩` : value}
      placeholder="입력해 주세요."
      keyboardType="number-pad"
      editable={!disabled}
      hasBaselineOffset={false}
      onChangeText={onChange}
      onBlur={handleBlur}
      onFocus={() => {
        setIsFocused(true);
        onFocus();
      }}
      errorMessage={errorMessage}
      labelAccessory={
        onHelpPress ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${label} 도움말`}
            onPress={onHelpPress}
            hitSlop={8}
            className="h-[18px] w-[18px] items-center justify-center rounded-full bg-motu-tonal"
          >
            <Text className="font-pretendard-bold text-[11px] leading-[14px] text-motu-text-secondary">
              ?
            </Text>
          </Pressable>
        ) : undefined
      }
    />
  );
}
