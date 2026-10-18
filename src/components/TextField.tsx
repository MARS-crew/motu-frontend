import { useState, type Ref } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  isRequired?: boolean;
  errorMessage?: string;
  helperText?: string;
  inputRef?: Ref<TextInput>;
  multilineSize?: 'default' | 'compact';
};

export function TextField({
  label,
  isRequired = false,
  errorMessage,
  helperText,
  multiline = false,
  multilineSize = 'default',
  inputRef,
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
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
          {label}
        </Text>
        {isRequired && (
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-red">*</Text>
        )}
      </View>
      <View
        className={`overflow-hidden rounded-xl border ${multiline ? (multilineSize === 'compact' ? 'h-[110px]' : 'h-[120px]') : 'h-[50px]'} ${
          hasError ? 'border-motu-red' : isFocused ? 'border-motu-black' : 'border-motu-border'
        } ${editable ? 'bg-white' : 'bg-motu-border'}`}
      >
        <TextInput
          ref={inputRef}
          accessibilityLabel={label}
          multiline={multiline}
          editable={editable}
          style={{
            includeFontPadding: false,
            textAlignVertical: multiline ? 'top' : 'center',
            transform: multiline ? [] : [{ translateY: -3 }],
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          className={`h-full px-4 font-pretendard-medium ${multiline ? 'py-[15px]' : 'py-0'} text-sm leading-5 text-motu-text-primary placeholder:text-motu-grey ${
            editable ? '' : 'text-motu-disabled'
          }`}
          {...inputProps}
        />
      </View>
      {errorMessage ? (
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-red">
          {errorMessage}
        </Text>
      ) : (
        helperText && (
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
            {helperText}
          </Text>
        )
      )}
    </View>
  );
}
