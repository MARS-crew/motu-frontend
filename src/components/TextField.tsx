import { useCallback, useRef, useState, type Ref, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { FormMessage } from '@/components/FormMessage';
import { useAndroidKeyboardRecovery } from '@/hooks/useAndroidKeyboardRecovery';

type TextFieldProps = TextInputProps & {
  label: string;
  variant?: 'default' | 'auth';
  labelAccessory?: ReactNode;
  isRequired?: boolean;
  errorMessage?: string;
  helperText?: string;
  inputRef?: Ref<TextInput>;
  multilineSize?: 'default' | 'compact' | 'short' | 'inquiry';
  inputAction?: ReactNode;
  inputEndAccessory?: ReactNode;
  hasBaselineOffset?: boolean;
  isInvalid?: boolean;
  hasMessageSpace?: boolean;
  messageSize?: 'single' | 'double';
  hasDesignMessagesOnly?: boolean;
};

export function TextField({
  label,
  variant = 'default',
  labelAccessory,
  inputAction,
  inputEndAccessory,
  isRequired = false,
  errorMessage,
  helperText,
  multiline = false,
  multilineSize = 'default',
  hasBaselineOffset = true,
  isInvalid = false,
  hasMessageSpace = true,
  messageSize = 'single',
  hasDesignMessagesOnly = false,
  inputRef,
  editable = true,
  onBlur,
  onFocus,
  onPressIn,
  showSoftInputOnFocus = true,
  ...inputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const nativeInputRef = useRef<TextInput>(null);
  const setInputRef = useCallback(
    (input: TextInput | null) => {
      nativeInputRef.current = input;
      if (typeof inputRef === 'function') inputRef(input);
      else if (inputRef) inputRef.current = input;
    },
    [inputRef],
  );
  const handleRecoverKeyboard = useAndroidKeyboardRecovery(
    nativeInputRef,
    editable && !inputProps.readOnly && inputProps.inputMode !== 'none' && showSoftInputOnFocus,
  );
  const isAuth = variant === 'auth';
  const hasError = Boolean(errorMessage) || isInvalid;

  const input = (
    <View
      className={`${inputAction ? 'min-w-0 flex-1' : ''} ${inputEndAccessory ? 'flex-row items-center' : ''} overflow-hidden ${isAuth ? 'rounded-auth-input' : 'rounded-xl'} border ${multiline ? (multilineSize === 'inquiry' ? 'h-[172px]' : multilineSize === 'short' ? 'h-[80px]' : multilineSize === 'compact' ? 'h-[110px]' : 'h-[120px]') : 'h-[50px]'} ${
        hasError ? 'border-motu-red' : isFocused ? 'border-motu-black' : 'border-motu-border'
      } ${editable ? (isAuth ? 'bg-motu-surface-card' : 'bg-white') : 'bg-motu-border'}`}
    >
      <TextInput
        ref={setInputRef}
        accessibilityLabel={label}
        multiline={multiline}
        editable={editable}
        showSoftInputOnFocus={showSoftInputOnFocus}
        onPressIn={(event) => {
          handleRecoverKeyboard();
          onPressIn?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setIsFocused(false);
          onBlur?.(event);
        }}
        className={`h-full ${inputEndAccessory ? 'min-w-0 flex-1' : ''} px-4 font-pretendard-medium text-no-font-padding ${multiline ? 'py-[15px] text-vertical-top' : `py-0 text-vertical-center ${hasBaselineOffset && !isAuth ? '-translate-y-[3px]' : ''}`} text-motu-text-primary outline-none ${isAuth ? 'px-[15px] text-[14px] leading-[20px] placeholder:text-motu-text-tertiary' : 'text-sm leading-5 placeholder:text-motu-grey'} ${
          editable ? '' : 'text-motu-disabled'
        }`}
        {...inputProps}
      />
      {inputEndAccessory}
    </View>
  );

  return (
    <View className="gap-[8px]">
      <View className={`flex-row items-center gap-1 ${labelAccessory ? 'h-[18px]' : ''}`}>
        <Text
          className={`font-pretendard-medium text-motu-text-secondary ${isAuth ? 'text-[12px] leading-[16px] text-no-font-padding' : 'text-xs leading-4'}`}
        >
          {label}
        </Text>
        {isRequired && (
          <Text className="font-pretendard-medium text-xs leading-4 text-motu-red">*</Text>
        )}
        {labelAccessory && <View className="ml-auto">{labelAccessory}</View>}
      </View>
      {inputAction ? (
        <View className={isAuth ? 'flex-row items-start gap-[8px]' : 'flex-row items-start gap-2'}>
          {input}
          {inputAction}
        </View>
      ) : (
        input
      )}
      {hasMessageSpace && (
        <FormMessage
          message={errorMessage || helperText}
          isError={Boolean(errorMessage)}
          size={messageSize}
          hasDesignMessagesOnly={isAuth || hasDesignMessagesOnly}
        />
      )}
    </View>
  );
}
