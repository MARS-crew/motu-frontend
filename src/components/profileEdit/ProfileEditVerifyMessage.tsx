import { Text } from 'react-native';

type ProfileEditVerifyMessageProps = {
  message: string;
  tone: 'success' | 'error';
};

// 인증번호 발송·인증 결과를 안내하는 한 줄 문구입니다.
export function ProfileEditVerifyMessage({ message, tone }: ProfileEditVerifyMessageProps) {
  return (
    <Text
      accessibilityRole={tone === 'error' ? 'alert' : undefined}
      accessibilityLiveRegion="polite"
      className={`font-pretendard-medium text-[12px] leading-[20px] text-no-font-padding ${
        tone === 'success' ? 'text-motu-success' : 'text-motu-btn-red'
      }`}
    >
      {message}
    </Text>
  );
}
