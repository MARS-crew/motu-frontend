import { Image } from 'expo-image';
import { cssInterop } from 'nativewind';
import { Pressable, Text, View } from 'react-native';

import type { NoticeListItem as NoticeListItemData } from '@/types/notice';

cssInterop(Image, { className: 'style' });

type NoticeListItemProps = {
  notice: NoticeListItemData;
  onPress?: () => void;
};

export function NoticeListItem({ notice, onPress }: NoticeListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-motu-grey-lighter bg-white p-4 active:opacity-80"
    >
      {/* Pretendard 한글은 줄 높이 안에서 위로 치우쳐 보여서, 칩은 위 패딩을 더 줘 글자를 가운데로 맞춥니다. */}
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          {notice.isImportant && (
            <View className="rounded-md bg-motu-red/10 px-1.5 pb-[1.1px] pt-[2.9px]">
              <Text className="font-pretendard-bold text-[10.5px] leading-[12.6px] text-motu-red">
                중요
              </Text>
            </View>
          )}
          <Text
            numberOfLines={1}
            className="flex-shrink font-pretendard-semibold text-[13.5px] leading-[16.2px] text-motu-black"
          >
            {notice.title}
          </Text>
        </View>
        <View className="mt-1.5 flex-row items-center gap-1.5">
          <View className="rounded-md bg-motu-grey-lighter/70 px-1.5 pb-[1.1px] pt-[2.9px]">
            <Text className="font-pretendard-medium text-[11.5px] leading-[13.8px] text-motu-grey">
              {notice.category}
            </Text>
          </View>
          <Text className="font-pretendard text-[11.5px] leading-[13.8px] text-motu-grey">
            {notice.createdAt}
          </Text>
        </View>
      </View>
      <Image
        source={require('../../../assets/icons/notice/chevronRight.svg')}
        contentFit="contain"
        className="h-[18px] w-[18px]"
      />
    </Pressable>
  );
}
