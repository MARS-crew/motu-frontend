import { Pressable, Text } from 'react-native';

import type { Notice } from '@/types/home';

type NoticeBannerProps = {
  // 게시 중인 공지가 없으면 null입니다. 공지사항·FAQ 페이지 입구라 배너는 계속 보여줍니다.
  notice: Notice | null;
  // 공지가 없을 때 제목 자리에 보여줄 문구입니다. (조회 중에는 빈 문자열)
  emptyMessage?: string;
  onPress: () => void;
};

export function NoticeBanner({
  notice,
  emptyMessage = '등록된 공지사항이 없습니다.',
  onPress,
}: NoticeBannerProps) {
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
        {notice ? notice.title : emptyMessage}
      </Text>
      {notice && (
        <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey-light">
          {notice.createdAt}
        </Text>
      )}
    </Pressable>
  );
}
