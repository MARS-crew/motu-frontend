import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DevLoginToggle } from '@/components/DevLoginToggle';
import { AssetSummaryCard } from '@/components/home/AssetSummaryCard';
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeSection } from '@/components/home/HomeSection';
import { HomeStockList } from '@/components/home/HomeStockList';
import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { NoticeBanner } from '@/components/home/NoticeBanner';
import { useHomeNewListingsQuery } from '@/queries/useHomeNewListingsQuery';
import { useLatestNoticeQuery } from '@/queries/useLatestNoticeQuery';
import { usePortfolioQuery } from '@/queries/usePortfolioQuery';
import { useRecentlyViewedQuery } from '@/queries/useRecentlyViewedQuery';
import { useTradeHistorySummaryQuery } from '@/queries/useTradeHistorySummaryQuery';
import { useUnreadNotificationCountQuery } from '@/queries/useUnreadNotificationCountQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import type { AssetSummary, StockSummary } from '@/types/home';
import type { Portfolio } from '@/types/portfolio';
import type { NewListingItem, StockItem } from '@/types/stock';
import { formatDotDate } from '@/utils/formatDate';
import { getInitialTradeHistoryRange } from '@/utils/tradeHistory';

// 화면설계서 기준으로 최근 본 종목과 신규 상장은 최신순 3개까지만 보여줍니다.
const HOME_LIST_LIMIT = 3;

const toStockSummary = (stock: StockItem): StockSummary => ({
  id: stock.stockId,
  name: stock.name,
  price: stock.currentPrice,
  changeRate: stock.changeRate,
  logoImageUrl: stock.logoImageUrl,
});

const toNewListingSummary = (stock: NewListingItem): StockSummary => ({
  ...toStockSummary(stock),
  description: stock.summary,
  listedAt: formatDotDate(stock.listingDate),
});

const toAssetSummary = ({ summary }: Portfolio, tradeAmount: number | null): AssetSummary => ({
  totalAsset: summary.totalAsset,
  totalReturnRate: summary.profitRate,
  profitLoss: summary.profit,
  purchaseAmount: summary.purchaseAmount,
  tradeAmount,
});

const getNoticeEmptyMessage = (status: 'pending' | 'error' | 'success') => {
  if (status === 'pending') return '';
  if (status === 'error') return '공지사항을 불러오지 못했어요.';
  return '등록된 공지사항이 없습니다.';
};

export default function HomeScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const latestNoticeQuery = useLatestNoticeQuery();
  const recentlyViewedQuery = useRecentlyViewedQuery();
  const newListingsQuery = useHomeNewListingsQuery();
  const latestNotice = latestNoticeQuery.data;
  const { data: unreadNotificationCount = 0 } = useUnreadNotificationCountQuery();
  const hasUnreadNotification = isLoggedIn && unreadNotificationCount > 0;
  const portfolioQuery = usePortfolioQuery();
  // 거래 대금은 거래내역 화면의 기본 기간과 같은 이번 달(1일~오늘) 거래금액입니다.
  const monthRange = getInitialTradeHistoryRange();
  const tradeSummaryQuery = useTradeHistorySummaryQuery({
    from: monthRange.start,
    to: monthRange.end,
  });
  const { refetch: refetchPortfolio } = portfolioQuery;
  const { refetch: refetchTradeSummary } = tradeSummaryQuery;
  const assetSummary = portfolioQuery.data
    ? toAssetSummary(portfolioQuery.data, tradeSummaryQuery.data?.totalAmount ?? null)
    : undefined;

  // 탭 화면은 계속 마운트되어 있어, 다시 들어올 때마다 현재가 기준 자산과 거래 대금을 새로 불러옵니다. (진행 중인 요청이 있으면 그 결과를 씁니다)
  useFocusEffect(
    useCallback(() => {
      if (!isLoggedIn) return;
      void refetchPortfolio({ cancelRefetch: false });
      void refetchTradeSummary({ cancelRefetch: false });
    }, [isLoggedIn, refetchPortfolio, refetchTradeSummary]),
  );

  const handleSearchPress = () => router.push('/search');

  const handleFavoritePress = () => router.push('/favorites');

  const handleNotificationPress = () => router.push('/notification');

  const handleNoticePress = () => router.push('/notice');

  const handleNewListingsMore = () => router.push('/new-listings');

  const handleStockPress = (stockId: number) =>
    router.push({ pathname: '/product/[id]', params: { id: String(stockId) } });

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
          <AssetSummaryCard
            summary={assetSummary}
            isLoggedIn={isLoggedIn}
            isLoading={portfolioQuery.isPending}
            isError={portfolioQuery.isError}
          />

          <NoticeBanner
            notice={
              latestNotice
                ? {
                    id: latestNotice.noticeId,
                    title: latestNotice.title,
                    createdAt: formatDotDate(latestNotice.postDate),
                  }
                : null
            }
            emptyMessage={getNoticeEmptyMessage(latestNoticeQuery.status)}
            onPress={handleNoticePress}
          />

          <HomeSection title="최근 본 종목">
            {isLoggedIn ? (
              <HomeStockList
                stocks={recentlyViewedQuery.data?.slice(0, HOME_LIST_LIMIT).map(toStockSummary)}
                isLoading={recentlyViewedQuery.isPending}
                isError={recentlyViewedQuery.isError}
                emptyMessage="최근 본 종목이 없습니다."
                onStockPress={handleStockPress}
              />
            ) : (
              <LoginRequiredBox />
            )}
          </HomeSection>

          <HomeSection title="신규 상장" onMorePress={handleNewListingsMore}>
            {isLoggedIn ? (
              <HomeStockList
                stocks={newListingsQuery.data?.slice(0, HOME_LIST_LIMIT).map(toNewListingSummary)}
                isLoading={newListingsQuery.isPending}
                isError={newListingsQuery.isError}
                emptyMessage="신규 상장 종목이 없습니다."
                onStockPress={handleStockPress}
              />
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
