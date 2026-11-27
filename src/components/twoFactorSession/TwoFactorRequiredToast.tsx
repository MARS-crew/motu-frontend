import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export function TwoFactorRequiredToast() {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(false), 2500);
    return () => clearTimeout(timeout);
  }, []);
  if (!isVisible) return null;
  return (
    <View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      className="absolute bottom-[106px] left-[24px] right-[24px] h-[48px] flex-row items-center gap-[8px] rounded-[12px] bg-motu-black px-[16px] shadow-security-toast"
    >
      <Image
        source={require('../../../assets/icons/twoFactorSession/info.svg')}
        className="h-[16px] w-[16px]"
        contentFit="contain"
        accessible={false}
      />
      <Text className="font-pretendard-bold text-[14px] leading-[20px] text-motu-on-cta text-no-font-padding">
        2차 보안 설정 후 이용해 주세요.
      </Text>
    </View>
  );
}
