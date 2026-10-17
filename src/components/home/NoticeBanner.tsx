import { Pressable, Text } from 'react-native';

import type { Notice } from '@/types/home';

type NoticeBannerProps = {
  notice: Notice;
  onPress: () => void;
};

export function NoticeBanner({ notice, onPress }: NoticeBannerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-3 rounded-2xl border border-motu-grey-lighter bg-white px-4 py-3 active:opacity-80"
    >
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">공지사항</Text>
      <Text
        numberOfLines={1}
        className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-grey"
      >
        {notice.title}
      </Text>
      <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey-light">
        {notice.createdAt}
      </Text>
    </Pressable>
  );
}
