import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FaqSection } from '@/components/faq/FaqSection';
import { NoticeEmpty } from '@/components/notice/NoticeEmpty';
import { NoticeListItem } from '@/components/notice/NoticeListItem';
import { NoticeTabs, type NoticeTab } from '@/components/notice/NoticeTabs';
import { Pagination } from '@/components/Pagination';
import { TopBar } from '@/components/TopBar';
import { useNoticesQuery } from '@/queries/useNoticesQuery';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function NoticeScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [selectedTab, setSelectedTab] = useState<NoticeTab>('notice');
  const [currentPage, setCurrentPage] = useState(1);
  // 서버가 중요 공지를 먼저, 그다음 최근 게시순으로 정렬해서 내려줍니다.
  const { data, isPending, isError } = useNoticesQuery(currentPage);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleNoticePress = (id: number) =>
    router.push({ pathname: '/notice/[id]', params: { id: String(id) } });

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="공지사항 및 FAQ" onBack={handleBack} />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="px-6 pb-10 pt-1"
        showsVerticalScrollIndicator={false}
      >
        <NoticeTabs value={selectedTab} onValueChange={setSelectedTab} />

        {selectedTab === 'faq' && <FaqSection />}
        {selectedTab === 'notice' &&
          (isPending ? (
            <View className="items-center py-24">
              <ActivityIndicator />
            </View>
          ) : isError ? (
            <Text className="py-24 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
              공지사항을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.
            </Text>
          ) : data.notices.length > 0 ? (
            <>
              <View className="mt-5 gap-2.5">
                {data.notices.map((notice) => (
                  <NoticeListItem
                    key={notice.id}
                    notice={notice}
                    onPress={() => handleNoticePress(notice.id)}
                  />
                ))}
              </View>
              <Pagination
                currentPage={currentPage}
                totalPages={data.totalPages}
                visiblePageCount={5}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <NoticeEmpty />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}
