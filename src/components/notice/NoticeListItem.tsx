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
      {/* 칩은 높이를 고정하고 글자 위아래 여백(font padding)을 없애, 플랫폼과 관계없이 위아래 여백을 같게 맞춥니다. */}
      <View className="flex-1">
        <View className="flex-row items-center gap-1.5">
          {notice.isImportant && (
            <View className="h-[18px] justify-center rounded-md bg-motu-red/10 px-1.5">
              <Text className="font-pretendard-bold text-[10.5px] leading-[14px] text-motu-red text-no-font-padding text-vertical-center">
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
          <View className="h-[18px] justify-center rounded-md bg-motu-grey-lighter/70 px-1.5">
            <Text className="font-pretendard-medium text-[11.5px] leading-[14px] text-motu-grey text-no-font-padding text-vertical-center">
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
