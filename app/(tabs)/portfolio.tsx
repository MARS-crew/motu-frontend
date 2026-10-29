import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import { MarketSortDropdown } from '@/components/market/MarketSortDropdown';
import { AssetCompositionCard } from '@/components/portfolio/AssetCompositionCard';
import { HoldingListItem } from '@/components/portfolio/HoldingListItem';
import { PortfolioQuickMenu } from '@/components/portfolio/PortfolioQuickMenu';
import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummaryCard';
import { TabHeader } from '@/components/TabHeader';
import { HOLDING_SORT_OPTIONS } from '@/constants/portfolioPreview';
import { usePortfolioQuery } from '@/queries/usePortfolioQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import type { HoldingSort } from '@/types/portfolio';
import { getAssetComposition, sortHoldings } from '@/utils/portfolio';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';

export default function PortfolioScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [sort, setSort] = useState<HoldingSort>('valuation');
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { data: portfolio, isPending, isError, refetch } = usePortfolioQuery();

  // 탭 화면은 계속 마운트되어 있어, 다시 들어올 때마다 현재가 기준 자산을 새로 불러옵니다. (진행 중인 요청이 있으면 그 결과를 씁니다)
  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) void refetch({ cancelRefetch: false });
    }, [isLoggedIn, refetch]),
  );

  const composition = useMemo(
    () => (portfolio ? getAssetComposition(portfolio.summary.cash, portfolio.holdings) : []),
    [portfolio],
  );
  const sortedHoldings = useMemo(
    () => (portfolio ? sortHoldings(portfolio.holdings, sort) : []),
    [portfolio, sort],
  );

  const handleSearchPress = () => router.push('/search');
  const handleFavoritePress = () => router.push('/favorites');
  const handleTransactionsPress = () => router.push('/transactions');
  const handleAssetManagementPress = () => router.push('/asset-management');
  // AI 분석 화면이 추가되면 연결합니다.
  const handleAiAnalysisPress = () => {};

  const renderAssets = () => {
    if (!isLoggedIn) {
      return (
        <View className="px-6 pt-2">
          <LoginRequiredBox />
        </View>
      );
    }

    if (isPending) {
      return <ActivityIndicator className="py-20" />;
    }

    if (!portfolio) {
      return (
        <Text className="py-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          {isError
            ? '포트폴리오를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
            : '포트폴리오 정보가 없습니다.'}
        </Text>
      );
    }

    const { summary } = portfolio;

    return (
      <>
        <View className="px-6 pt-2">
          <PortfolioSummaryCard
            totalAsset={summary.totalAsset}
            cash={summary.cash}
            valuation={summary.valuation}
            profit={summary.profit}
            profitRate={summary.profitRate}
            updatedAt={summary.updatedAt}
          />
        </View>

        <View className="px-6 pt-4">
          <AssetCompositionCard items={composition} valuation={summary.valuation} />
        </View>
      </>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <TabHeader
        isScrolled={isScrolled}
        title="포트폴리오"
        onSearchPress={handleSearchPress}
        onFavoritePress={handleFavoritePress}
      />

      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        {renderAssets()}

        <View className="px-6 pt-6">
          <PortfolioQuickMenu
            onTransactionsPress={handleTransactionsPress}
            onAssetManagementPress={handleAssetManagementPress}
            onAiAnalysisPress={handleAiAnalysisPress}
          />
        </View>

        {portfolio && (
          <View className="p-6">
            <View className="z-10 flex-row items-center justify-between">
              <Text className="font-pretendard-bold text-[13px] leading-[19.5px] text-motu-black">
                보유 종목
              </Text>
              <MarketSortDropdown
                options={HOLDING_SORT_OPTIONS}
                value={sort}
                onValueChange={setSort}
                align="right"
              />
            </View>

            <View className="mt-2 overflow-hidden rounded-xl border border-motu-grey-lighter bg-white">
              {sortedHoldings.length > 0 ? (
                sortedHoldings.map((holding, index) => (
                  <HoldingListItem key={holding.id} holding={holding} isFirst={index === 0} />
                ))
              ) : (
                <Text className="py-10 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
                  보유 중인 종목이 없습니다.
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
