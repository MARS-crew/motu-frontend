import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  isRequired?: boolean;
  errorMessage?: string;
  helperText?: string;
};

export function TextField({
  label,
  isRequired = false,
  errorMessage,
  helperText,
  editable = true,
  onBlur,
  onFocus,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-1">
        <Text className="font-inter-medium text-xs leading-4 text-motu-text-secondary">
          {label}
        </Text>
        {isRequired && <Text className="font-inter-medium text-xs leading-4 text-motu-red">*</Text>}
      </View>
      <View
        className={`h-[50px] overflow-hidden rounded-xl border ${
          hasError ? 'border-motu-red' : isFocused ? 'border-motu-black' : 'border-motu-border'
        } ${editable ? 'bg-white' : 'bg-motu-border'}`}
      >
        <TextInput
          editable={editable}
          style={{
            includeFontPadding: false,
            textAlignVertical: 'center',
            transform: [{ translateY: -3 }],
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          className={`font-inter-medium h-full px-4 py-0 text-sm leading-5 text-motu-text-primary placeholder:text-motu-grey ${
            editable ? '' : 'text-motu-disabled'
          }`}
          {...inputProps}
        />
      </View>
      {errorMessage ? (
        <Text className="font-inter-medium text-xs leading-4 text-motu-red">{errorMessage}</Text>
      ) : (
        helperText && (
          <Text className="font-inter-medium text-xs leading-4 text-motu-text-secondary">
            {helperText}
          </Text>
        )
      )}
    </View>
  );
}
