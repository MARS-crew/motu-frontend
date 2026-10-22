import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DevLoginToggle } from '@/components/DevLoginToggle';
import { AssetSummaryCard } from '@/components/home/AssetSummaryCard';
import { HomeEmptyBox } from '@/components/home/HomeEmptyBox';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSection } from '@/components/home/HomeSection';
import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { NoticeBanner } from '@/components/home/NoticeBanner';
import { StockListItem } from '@/components/home/StockListItem';
import { ASSET_SUMMARY, LATEST_NOTICE, NEW_LISTINGS, RECENT_STOCKS } from '@/constants/homePreview';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationPreviewStore } from '@/stores/useNotificationPreviewStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

// 화면설계서 기준으로 최근 본 종목과 신규 상장은 최신순 3개까지만 보여줍니다.
const HOME_LIST_LIMIT = 3;

export default function HomeScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const hasUnreadNotification = useNotificationPreviewStore((state) =>
    state.notifications.some((notification) => !notification.isRead),
  );

  const handleSearchPress = () => router.push('/search');

  const handleFavoritePress = () => router.push('/favorites');

  const handleNotificationPress = () => router.push('/notification');

  const handleNoticePress = () => router.push('/notice');

  const handleNewListingsMore = () => router.push('/new-listings');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <HomeHeader
        isScrolled={isScrolled}
        hasUnreadNotification={hasUnreadNotification}
        onSearchPress={handleSearchPress}
        onFavoritePress={handleFavoritePress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-4 px-6 pb-7 pt-1">
          <AssetSummaryCard summary={isLoggedIn ? ASSET_SUMMARY : null} />

          <NoticeBanner notice={LATEST_NOTICE} onPress={handleNoticePress} />

          <HomeSection title="최근 본 종목">
            {!isLoggedIn ? (
              <LoginRequiredBox />
            ) : RECENT_STOCKS.length > 0 ? (
              <View className="gap-2">
                {RECENT_STOCKS.slice(0, HOME_LIST_LIMIT).map((stock) => (
                  <StockListItem key={stock.id} stock={stock} />
                ))}
              </View>
            ) : (
              <HomeEmptyBox message="최근 본 종목이 없습니다." />
            )}
          </HomeSection>

          <HomeSection title="신규 상장" onMorePress={handleNewListingsMore}>
            {isLoggedIn ? (
              <View className="gap-2">
                {NEW_LISTINGS.slice(0, HOME_LIST_LIMIT).map((stock) => (
                  <StockListItem key={stock.id} stock={stock} />
                ))}
              </View>
            ) : (
              <LoginRequiredBox />
            )}
          </HomeSection>

          <DevLoginToggle />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
