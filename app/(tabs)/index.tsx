import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssetSummaryCard } from '@/components/home/AssetSummaryCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSection } from '@/components/home/HomeSection';
import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { NoticeBanner } from '@/components/home/NoticeBanner';
import { StockListItem } from '@/components/home/StockListItem';
import {
  ASSET_SUMMARY,
  HAS_UNREAD_NOTIFICATION,
  LATEST_NOTICE,
  NEW_LISTINGS,
  RECENT_STOCKS,
} from '@/constants/homePreview';
import { useAuthStore } from '@/stores/useAuthStore';

export default function HomeScreen() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  // 신규 상장 목록 화면이 추가되면 이동을 연결합니다.
  const handleNewListingsMore = () => {};

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <HomeHeader hasUnreadNotification={HAS_UNREAD_NOTIFICATION} />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="gap-4 px-6 pb-7 pt-1">
          <AssetSummaryCard summary={isLoggedIn ? ASSET_SUMMARY : null} />

          <NoticeBanner notice={LATEST_NOTICE} />

          <HomeSection title="최근 본 종목">
            {isLoggedIn ? (
              <View className="gap-2">
                {RECENT_STOCKS.map((stock) => (
                  <StockListItem key={stock.id} stock={stock} />
                ))}
              </View>
            ) : (
              <LoginRequiredBox />
            )}
          </HomeSection>

          <HomeSection title="신규 상장" onMorePress={handleNewListingsMore}>
            {isLoggedIn ? (
              <View className="gap-2">
                {NEW_LISTINGS.map((stock) => (
                  <StockListItem key={stock.id} stock={stock} />
                ))}
              </View>
            ) : (
              <LoginRequiredBox />
            )}
          </HomeSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
