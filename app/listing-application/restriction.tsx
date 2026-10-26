import { Redirect, router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '@/components/TopBar';
import { LISTING_RESTRICTION_DESCRIPTION } from '@/constants/listingRestrictionPreview';
import { useListingAccess } from '@/hooks/useListingAccess';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function ListingRestrictionScreen() {
  const access = useListingAccess();
  const { isScrolled, handleScroll } = useHeaderScroll();
  const handleBack = () =>
    router.canGoBack() ? router.back() : router.replace('/listing-application');

  if (!access.isLoggedIn) return <Redirect href="/(auth)/login" />;
  if (!access.restriction) {
    if (access.isChecking) return null;
    return <Redirect href="/listing-application" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-motu-bg">
      <TopBar isScrolled={isScrolled} title="상장 신청 제한" onBack={handleBack} />
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        contentContainerClassName="px-6 pb-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="self-start rounded-full bg-motu-red-light px-[14px] py-1.5">
          <Text className="font-pretendard-medium text-xs text-motu-btn-red">
            {access.restriction.label}
          </Text>
        </View>
        <Text
          accessibilityRole="header"
          className="mt-6 font-pretendard-bold text-2xl leading-8 text-motu-text-primary"
        >
          {'현재 계정으로 상장 신청을\n진행할 수 없습니다.'}
        </Text>
        <View className="mt-5 rounded-[10px] bg-motu-red-light px-[14px] py-3">
          <Text className="font-pretendard-medium text-[13px] leading-[18px] text-motu-red">
            {LISTING_RESTRICTION_DESCRIPTION}
          </Text>
        </View>
      </ScrollView>
      <View className="px-6 pb-7 pt-4">
        <Pressable
          accessibilityRole="button"
          className="min-h-[52px] items-center justify-center rounded-xl bg-motu-grey-chip py-4"
        >
          <Text className="font-pretendard-bold text-[15px] text-motu-black">문의하기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
