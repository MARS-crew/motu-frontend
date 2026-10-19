import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChartPeriodSelector } from '@/components/productDetail/ChartPeriodSelector';
import { OrderBookCard } from '@/components/productDetail/OrderBookCard';
import { OrderButtons } from '@/components/productDetail/OrderButtons';
import { PriceChart } from '@/components/productDetail/PriceChart';
import { ProductDetailHeader } from '@/components/productDetail/ProductDetailHeader';
import { ProductDetailTabs } from '@/components/productDetail/ProductDetailTabs';
import { ProductSummary } from '@/components/productDetail/ProductSummary';
import { RecentTradeList } from '@/components/productDetail/RecentTradeList';
import { TradeSummaryCard } from '@/components/productDetail/TradeSummaryCard';
import {
  CHART_PERIOD_OPTIONS,
  getOrderBook,
  getProductCandles,
  getProductDetail,
  getRecentTrades,
} from '@/constants/productDetailPreview';
import type { ChartPeriod } from '@/types/product';

type DetailTab = 'chart' | 'orderBook' | 'info';

// 탭 순서는 피그마 기준(차트 · 호가 · 종목 정보)이며 차트 탭을 기본으로 엽니다.
const DETAIL_TABS: { label: string; value: DetailTab }[] = [
  { label: '차트', value: 'chart' },
  { label: '호가', value: 'orderBook' },
  { label: '종목 정보', value: 'info' },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = useMemo(() => getProductDetail(Number(id)), [id]);

  const [selectedTab, setSelectedTab] = useState<DetailTab>('chart');
  const [period, setPeriod] = useState<ChartPeriod>('day');
  const [isFavorite, setIsFavorite] = useState(product?.isFavorite ?? false);

  const candles = useMemo(
    () => (product ? getProductCandles(product, period) : []),
    [product, period],
  );
  const orderBook = useMemo(() => (product ? getOrderBook(product) : undefined), [product]);
  const recentTrades = useMemo(() => (product ? getRecentTrades(product) : []), [product]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/market');
    }
  };

  // 지정가 알림(MOTU-21), 매수·매도(MOTU-22) 모달이 추가되면 연결합니다.
  const handleAlertPress = () => {};

  const handleOrderPress = () => {};

  if (!product) {
    return (
      <SafeAreaView className="flex-1 bg-motu-bg">
        <ProductDetailHeader
          isFavorite={false}
          onBack={handleBack}
          onAlertPress={handleAlertPress}
          onFavoritePress={() => {}}
        />
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          상품 정보를 찾을 수 없습니다.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <ProductDetailHeader
        isFavorite={isFavorite}
        onBack={handleBack}
        onAlertPress={handleAlertPress}
        onFavoritePress={() => setIsFavorite((previousIsFavorite) => !previousIsFavorite)}
      />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <ProductSummary product={product} />

        <View className="pt-5">
          <ProductDetailTabs
            tabs={DETAIL_TABS}
            value={selectedTab}
            onValueChange={setSelectedTab}
          />
        </View>

        {selectedTab === 'chart' ? (
          <>
            <View className="px-6 pt-4">
              <View className="rounded-xl border border-motu-grey-lighter bg-white px-[13px] pb-[13px] pt-[17px]">
                <PriceChart candles={candles} currentPrice={product.price} period={period} />
                <View className="pt-3">
                  <ChartPeriodSelector
                    options={CHART_PERIOD_OPTIONS}
                    value={period}
                    onValueChange={setPeriod}
                  />
                </View>
              </View>
            </View>
            <View className="px-6 pb-8 pt-5">
              <TradeSummaryCard summary={product.summary} />
            </View>
          </>
        ) : selectedTab === 'orderBook' && orderBook ? (
          <>
            <View className="px-6 pt-4">
              <OrderBookCard
                orderBook={orderBook}
                currentPrice={product.price}
                changeRate={product.changeRate}
              />
            </View>
            <View className="px-6 pb-8 pt-5">
              <RecentTradeList trades={recentTrades} />
            </View>
          </>
        ) : (
          // 종목 정보(MOTU-20) 탭은 해당 작업에서 구현합니다.
          <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
            준비 중입니다.
          </Text>
        )}
      </ScrollView>

      <OrderButtons onSellPress={handleOrderPress} onBuyPress={handleOrderPress} />
    </SafeAreaView>
  );
}
