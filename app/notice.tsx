import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FaqSection } from '@/components/faq/FaqSection';
import { NoticeEmpty } from '@/components/notice/NoticeEmpty';
import { NoticeListItem } from '@/components/notice/NoticeListItem';
import { NoticeTabs, type NoticeTab } from '@/components/notice/NoticeTabs';
import { Pagination } from '@/components/Pagination';
import { TopBar } from '@/components/TopBar';
import { NOTICE_PAGE_SIZE, NOTICES } from '@/constants/noticePreview';

// 중요 공지를 목록 상단에 먼저 보여줍니다. 서버 연동 시 API 정렬 결과를 그대로 사용합니다
const SORTED_NOTICES = [...NOTICES].sort((a, b) => Number(b.isImportant) - Number(a.isImportant));

export default function NoticeScreen() {
  const [selectedTab, setSelectedTab] = useState<NoticeTab>('notice');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(SORTED_NOTICES.length / NOTICE_PAGE_SIZE);
  const pageNotices = SORTED_NOTICES.slice(
    (currentPage - 1) * NOTICE_PAGE_SIZE,
    currentPage * NOTICE_PAGE_SIZE,
  );

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
      <TopBar title="공지사항 및 FAQ" onBack={handleBack} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-10 pt-1"
        showsVerticalScrollIndicator={false}
      >
        <NoticeTabs value={selectedTab} onValueChange={setSelectedTab} />

        {selectedTab === 'faq' && <FaqSection />}
        {selectedTab === 'notice' &&
          (SORTED_NOTICES.length > 0 ? (
            <>
              <View className="mt-5 gap-2.5">
                {pageNotices.map((notice) => (
                  <NoticeListItem
                    key={notice.id}
                    notice={notice}
                    onPress={() => handleNoticePress(notice.id)}
                  />
                ))}
              </View>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
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
