import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MarketSortDropdown } from '@/components/market/MarketSortDropdown';
import { AssetCompositionCard } from '@/components/portfolio/AssetCompositionCard';
import { HoldingListItem } from '@/components/portfolio/HoldingListItem';
import { PortfolioQuickMenu } from '@/components/portfolio/PortfolioQuickMenu';
import { PortfolioSummaryCard } from '@/components/portfolio/PortfolioSummaryCard';
import { TabHeader } from '@/components/TabHeader';
import { HOLDING_SORT_OPTIONS, HOLDINGS, PORTFOLIO_SUMMARY } from '@/constants/portfolioPreview';
import type { HoldingSort } from '@/types/portfolio';
import { getAssetComposition, sortHoldings } from '@/utils/portfolio';

export default function PortfolioScreen() {
  const [sort, setSort] = useState<HoldingSort>('valuation');

  const valuation = HOLDINGS.reduce((sum, holding) => sum + holding.valuation, 0);
  const { cash, profit, updatedAt } = PORTFOLIO_SUMMARY;
  // 수익률은 평가손익을 매입금액(평가금액 - 평가손익)으로 나눈 값입니다.
  const profitRate = valuation - profit > 0 ? (profit / (valuation - profit)) * 100 : 0;
  const composition = useMemo(() => getAssetComposition(cash, HOLDINGS), [cash]);
  const sortedHoldings = useMemo(() => sortHoldings(HOLDINGS, sort), [sort]);

  const handleSearchPress = () => router.push('/search');
  const handleFavoritePress = () => router.push('/favorites');
  const handleTransactionsPress = () => router.push('/transactions');
  const handleAssetManagementPress = () => router.push('/asset-management');
  // AI 분석 화면이 추가되면 연결합니다.
  const handleAiAnalysisPress = () => {};

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <TabHeader
        title="포트폴리오"
        onSearchPress={handleSearchPress}
        onFavoritePress={handleFavoritePress}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-2">
          <PortfolioSummaryCard
            totalAsset={cash + valuation}
            cash={cash}
            valuation={valuation}
            profit={profit}
            profitRate={profitRate}
            updatedAt={updatedAt}
          />
        </View>

        <View className="px-6 pt-4">
          <AssetCompositionCard items={composition} valuation={valuation} />
        </View>

        <View className="px-6 pt-6">
          <PortfolioQuickMenu
            onTransactionsPress={handleTransactionsPress}
            onAssetManagementPress={handleAssetManagementPress}
            onAiAnalysisPress={handleAiAnalysisPress}
          />
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}
