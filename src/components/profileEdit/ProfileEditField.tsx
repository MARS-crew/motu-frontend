import { useState, type ReactNode } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type ProfileEditFieldProps = TextInputProps & {
  label: string;
  isRequired?: boolean;
  helperText?: string;
  errorMessage?: string;
  accessory?: ReactNode;
};

// 회원정보 수정 폼의 입력 한 칸: 라벨 + 입력창(46px) + 안내/오류 문구
export function ProfileEditField({
  label,
  isRequired = false,
  helperText,
  errorMessage,
  accessory,
  editable = true,
  onFocus,
  onBlur,
  ...inputProps
}: ProfileEditFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);

  return (
    <View className="gap-[8px]">
      <Text className="font-pretendard-semibold text-[12px] leading-[18px] text-motu-black">
        {isRequired ? `${label} *` : label}
      </Text>
      <View>
        <View
          className={`h-[46px] flex-row items-center gap-[8px] rounded-[8px] border px-[13px] ${
            hasError
              ? 'border-motu-red'
              : isFocused
                ? 'border-motu-black'
                : 'border-motu-grey-lighter'
          } ${editable ? 'bg-white' : 'bg-motu-grey-chip'}`}
        >
          <TextInput
            accessibilityLabel={label}
            editable={editable}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            className={`h-full min-w-0 flex-1 py-0 font-pretendard text-[13px] leading-[19.5px] outline-none text-no-font-padding text-vertical-center placeholder:text-motu-grey-light ${
              editable ? 'text-motu-black' : 'text-motu-grey'
            }`}
            {...inputProps}
          />
          {accessory}
        </View>
        {(errorMessage || helperText) && (
          <Text
            accessibilityRole={hasError ? 'alert' : undefined}
            className={`mt-[6px] font-pretendard text-[11px] leading-[16.5px] ${
              hasError ? 'text-motu-red' : 'text-motu-grey-light'
            }`}
          >
            {errorMessage ?? helperText}
          </Text>
        )}
      </View>
    </View>
  );
}
