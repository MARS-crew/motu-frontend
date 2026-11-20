import { Text, View } from 'react-native';

import { getDesignedFormError } from '@/utils/designedFormError';

type FormMessageProps = {
  message?: string | null;
  isError?: boolean;
  size?: 'single' | 'double';
  hasDesignMessagesOnly?: boolean;
};

// 빈 상태에서도 같은 공간을 유지하여 검증 결과가 폼의 위치를 바꾸지 않게 합니다.
export function FormMessage({
  message,
  isError = true,
  size = 'single',
  hasDesignMessagesOnly = true,
}: FormMessageProps) {
  const visibleMessage = isError && hasDesignMessagesOnly ? getDesignedFormError(message) : message;
  return (
    <View className={`shrink-0 ${size === 'double' ? 'h-[32px]' : 'h-[16px]'}`}>
      {visibleMessage ? (
        <Text
          accessibilityLiveRegion="polite"
          accessibilityLabel={visibleMessage}
          numberOfLines={size === 'single' ? 1 : 2}
          className={`font-pretendard-medium text-[12px] leading-[16px] text-no-font-padding ${isError ? 'text-motu-btn-red' : 'text-motu-text-tertiary'}`}
        >
          {visibleMessage}
        </Text>
      ) : null}
    </View>
  );
}
