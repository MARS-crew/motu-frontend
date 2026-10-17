import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

export function NotificationEmpty() {
  return (
    <View className="items-center px-6 pt-28">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-grey-lighter/70">
        <Image
          source={require('../../../assets/icons/notice/megaphone.svg')}
          contentFit="contain"
          className="h-6 w-6"
        />
      </View>
      <Text className="mt-4 text-center font-pretendard-semibold text-[13.5px] leading-[20.25px] text-motu-black">
        알림이 없습니다.
      </Text>
      <Text className="mt-1.5 text-center font-pretendard text-xs leading-[18px] text-motu-grey">
        {'주문 체결, 목표가 도달 등\n새로운 소식이 오면 알려드릴게요.'}
      </Text>
    </View>
  );
}
