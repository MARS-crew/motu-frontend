import { useState } from 'react';
import { Text, TextInput, View, type TextInputProps } from 'react-native';

type ProfileEditFieldProps = TextInputProps & {
  label: string;
  isRequired?: boolean;
  helperText?: string;
  errorMessage?: string;
  hasMessageSlot?: boolean;
};

// 회원정보 수정 폼의 입력 한 칸: 라벨 + 입력창(46px) + 안내/오류 문구
// hasMessageSlot이면 오류 문구 자리(17px)를 미리 남겨 오류가 생겨도 아래 칸이 밀리지 않습니다.
export function ProfileEditField({
  label,
  isRequired = false,
  helperText,
  errorMessage,
  hasMessageSlot = false,
  editable = true,
  onFocus,
  onBlur,
  ...inputProps
}: ProfileEditFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = Boolean(errorMessage);
  const message = errorMessage ?? helperText;

  return (
    <View className="gap-[8px]">
      <Text className="font-pretendard-semibold text-[12px] leading-[18px] text-motu-black">
        {isRequired ? `${label} *` : label}
      </Text>
      <View>
        <View
          className={`h-[46px] flex-row items-center rounded-[8px] border px-[13px] ${
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
        </View>
        {hasMessageSlot ? (
          <View className="h-[17px]">
            {hasError && (
              <Text
                accessibilityRole="alert"
                className="font-pretendard text-[11px] leading-[16.5px] text-motu-red"
              >
                {errorMessage}
              </Text>
            )}
          </View>
        ) : (
          message && (
            <Text
              accessibilityRole={hasError ? 'alert' : undefined}
              className={`mt-[6px] font-pretendard text-[11px] leading-[16.5px] ${
                hasError ? 'text-motu-red' : 'text-motu-grey-light'
              }`}
            >
              {message}
            </Text>
          )
        )}
      </View>
    </View>
  );
}
