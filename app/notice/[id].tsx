import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { getNoticeDetail } from '@/constants/noticePreview';

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const notice = getNoticeDetail(Number(id));

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/notice');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar title="공지" onBack={handleBack} />

      {notice ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-6 pb-10"
          showsVerticalScrollIndicator={false}
        >
          {/* 칩은 Pretendard 한글이 줄 높이 안에서 위로 치우쳐 보여서 위 패딩을 더 줘 가운데로 맞춥니다. */}
          <View className="flex-row items-center gap-2">
            <View className="rounded-md bg-motu-grey-lighter/70 px-2 pb-[1.1px] pt-[2.9px]">
              <Text className="font-pretendard-medium text-[11px] leading-[16.5px] text-motu-grey">
                {notice.category}
              </Text>
            </View>
            {notice.isImportant && (
              <View className="rounded-md bg-motu-red/10 px-2 pb-[1.1px] pt-[2.9px]">
                <Text className="font-pretendard-bold text-[11px] leading-[16.5px] text-motu-red">
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
            공지를 찾을 수 없어요.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
