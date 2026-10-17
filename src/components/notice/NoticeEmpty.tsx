import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Text, View } from 'react-native';

cssInterop(Image, { className: 'style' });

export function NoticeEmpty() {
  return (
    <View className="items-center justify-center gap-3 px-8 py-24">
      <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-grey-lighter/60">
        <Image
          source={require('../../../assets/icons/notice/megaphone.svg')}
          contentFit="contain"
          className="h-6 w-6"
        />
      </View>
      <Text className="text-center font-pretendard-bold text-[13px] leading-[18px] text-motu-black">
        등록된 공지사항이 없어요.
      </Text>
      <Text className="text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
        새로운 공지사항이 등록되면 이곳에서 알려드릴게요.
      </Text>
    </View>
  );
}
