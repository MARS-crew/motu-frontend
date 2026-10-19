import { useState, type Ref, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type TextFieldProps = TextInputProps & {
  label: string;
  labelAccessory?: ReactNode;
  isRequired?: boolean;
  errorMessage?: string;
  helperText?: string;
  inputRef?: Ref<TextInput>;
  multilineSize?: 'default' | 'compact' | 'short';
  inputAction?: ReactNode;
  hasBaselineOffset?: boolean;
};

export function TextField({
  label,
  labelAccessory,
  inputAction,
  isRequired = false,
  errorMessage,
  helperText,
  multiline = false,
  multilineSize = 'default',
  hasBaselineOffset = true,
  inputRef,
  editable = true,
  onBlur,
  onFocus,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  const input = (
    <View
      className={`${inputAction ? 'min-w-0 flex-1' : ''} overflow-hidden rounded-xl border ${multiline ? (multilineSize === 'short' ? 'h-[80px]' : multilineSize === 'compact' ? 'h-[110px]' : 'h-[120px]') : 'h-[50px]'} ${
        hasError ? 'border-motu-red' : isFocused ? 'border-motu-black' : 'border-motu-border'
      } ${editable ? 'bg-white' : 'bg-motu-border'}`}
    >
      <TextInput
        ref={inputRef}
        accessibilityLabel={label}
        multiline={multiline}
        editable={editable}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={`h-full px-4 font-pretendard-medium text-no-font-padding ${multiline ? 'py-[15px] text-vertical-top' : `py-0 text-vertical-center ${hasBaselineOffset ? '-translate-y-[3px]' : ''}`} text-sm leading-5 text-motu-text-primary outline-none placeholder:text-motu-grey ${
          editable ? '' : 'text-motu-disabled'
        }`}
        {...inputProps}
      />
    </View>
  );

  return (
    <View className={hasError && multilineSize === 'short' ? 'gap-1.5' : 'gap-2'}>
      <View className={`flex-row items-center gap-1 ${labelAccessory ? 'h-[18px]' : ''}`}>
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-text-secondary">
          {label}
        </Text>
        {isRequired && (
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-red">*</Text>
        )}
        {labelAccessory && <View className="ml-auto">{labelAccessory}</View>}
      </View>
      {inputAction ? (
        <View className="flex-row items-start gap-2">
          {input}
          {inputAction}
        </View>
      ) : (
        input
      )}
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
