import { router, useLocalSearchParams } from 'expo-router';
import { isAxiosError } from 'axios';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { useNoticeDetailQuery } from '@/queries/useNoticeDetailQuery';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function NoticeDetailScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: notice, isLoading, error } = useNoticeDetailQuery(Number(id));
  // 404는 삭제되었거나 게시 기간이 끝난 공지입니다.
  const isNotFound = isAxiosError(error) && error.response?.status === 404;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/notice');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="공지" onBack={handleBack} />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      ) : notice ? (
        <ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          className="flex-1"
          contentContainerClassName="px-6 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* 칩은 높이를 고정하고 글자 위아래 여백(font padding)을 없애, 플랫폼과 관계없이 위아래 여백을 같게 맞춥니다. */}
          <View className="flex-row items-center gap-2">
            <View className="h-[22px] justify-center rounded-md bg-motu-grey-lighter/70 px-2">
              <Text className="font-pretendard-medium text-[11px] leading-[16.5px] text-motu-grey text-no-font-padding text-vertical-center">
                {notice.category}
              </Text>
            </View>
            {notice.isImportant && (
              <View className="h-[22px] justify-center rounded-md bg-motu-red/10 px-2">
                <Text className="font-pretendard-bold text-[11px] leading-[16.5px] text-motu-red text-no-font-padding text-vertical-center">
                  중요
                </Text>
              </View>
            )}
          </View>

          <Text
            accessibilityRole="header"
            className="mt-3 font-pretendard-bold text-[19px] leading-[26.125px] text-motu-black"
          >
            {notice.title}
          </Text>
          <Text className="mt-2 font-pretendard text-xs leading-[18px] text-motu-grey">
            {notice.createdAt}
          </Text>

          <View className="mt-5 h-px bg-motu-grey-lighter" />

          <Text className="mt-6 font-pretendard text-[13px] leading-[21.125px] text-black">
            {notice.content}
          </Text>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
            {isNotFound || !error
              ? '공지를 찾을 수 없어요.'
              : '공지를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
