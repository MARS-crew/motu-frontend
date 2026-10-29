import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { isAxiosError } from 'axios';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChartPeriodSelector } from '@/components/productDetail/ChartPeriodSelector';
import { LoginRequiredModal } from '@/components/productDetail/LoginRequiredModal';
import { OrderBookCard } from '@/components/productDetail/OrderBookCard';
import { OrderButtons } from '@/components/productDetail/OrderButtons';
import { PriceAlertModal } from '@/components/productDetail/PriceAlertModal';
import { OrderSheet } from '@/components/productDetail/OrderSheet';
import { PriceAlertReleaseModal } from '@/components/productDetail/PriceAlertReleaseModal';
import { PriceChart } from '@/components/productDetail/PriceChart';
import { ProductDetailHeader } from '@/components/productDetail/ProductDetailHeader';
import { ProductDetailTabs } from '@/components/productDetail/ProductDetailTabs';
import { ProductInfoTable } from '@/components/productDetail/ProductInfoTable';
import { ProductSummary } from '@/components/productDetail/ProductSummary';
import { RecentTradeList } from '@/components/productDetail/RecentTradeList';
import { TradeSummaryCard } from '@/components/productDetail/TradeSummaryCard';
import { Toast } from '@/components/Toast';
import { CHART_PERIOD_OPTIONS } from '@/constants/productDetailPreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useCandlesQuery } from '@/queries/useCandlesQuery';
import { useOrderAvailableQuery } from '@/queries/useOrderAvailableQuery';
import { useOrderBookQuery } from '@/queries/useOrderBookQuery';
import {
  useDeletePriceAlertMutation,
  useSavePriceAlertMutation,
} from '@/queries/usePriceAlertMutation';
import { usePriceAlertQuery } from '@/queries/usePriceAlertQuery';
import { useRecentTradesQuery } from '@/queries/useRecentTradesQuery';
import { useStockDetailQuery } from '@/queries/useStockDetailQuery';
import { useTradeSummaryQuery } from '@/queries/useTradeSummaryQuery';
import { useWishlistMutation } from '@/queries/useWishlistMutation';
import { useAuthStore } from '@/stores/useAuthStore';
import type { OrderSide } from '@/types/order';
import type { ChartPeriod } from '@/types/product';
import { getApiErrorMessage } from '@/utils/apiError';

type DetailTab = 'chart' | 'orderBook' | 'info';

// 탭 순서는 화면설계서 기준(호가 · 차트 · 종목 정보)이며, 진입 시에는 차트 탭을 먼저 엽니다.
const DETAIL_TABS: { label: string; value: DetailTab }[] = [
  { label: '호가', value: 'orderBook' },
  { label: '차트', value: 'chart' },
  { label: '종목 정보', value: 'info' },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isLoading, error } = useStockDetailQuery(Number(id));
  const { mutate: toggleWishlist } = useWishlistMutation();

  const [selectedTab, setSelectedTab] = useState<DetailTab>('chart');
  const [period, setPeriod] = useState<ChartPeriod>('day');
  const [alertModal, setAlertModal] = useState<'form' | 'release' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [orderSide, setOrderSide] = useState<OrderSide | null>(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { isScrolled, handleScroll } = useHeaderScroll();

  const stockId = Number(id);
  const candlesQuery = useCandlesQuery(stockId, period);
  const { data: orderBook } = useOrderBookQuery(stockId);
  const { data: recentTrades = [] } = useRecentTradesQuery(stockId);
  const { data: tradeSummary } = useTradeSummaryQuery(stockId);
  const { data: orderAvailability, refetch: refetchOrderAvailability } =
    useOrderAvailableQuery(stockId);
  const { data: priceAlert = null } = usePriceAlertQuery(stockId);
  const { mutateAsync: savePriceAlert } = useSavePriceAlertMutation();
  const { mutate: deletePriceAlert, isPending: isDeletingPriceAlert } =
    useDeletePriceAlertMutation();
  const alertPrice = priceAlert?.targetPrice ?? null;

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/market');
    }
  };

  // 지정가 알림은 회원만 설정할 수 있습니다.
  const handleAlertPress = () => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }
    setAlertModal('form');
  };

  const handleAlertModalClose = () => setAlertModal(null);

  // 실패하면 모달이 서버 오류 문구를 보여주도록 오류를 그대로 넘깁니다.
  const handleAlertSubmit = async (price: number) => {
    await savePriceAlert({
      stockId,
      targetPrice: price,
      alertId: priceAlert?.alertId ?? null,
    });
    setAlertModal(null);
  };

  // 해제를 취소하면 수정 모달로 돌아갑니다. (화면설계서 USR-MARKET-02-M01)
  const handleAlertRelease = () => {
    if (!priceAlert || isDeletingPriceAlert) return;
    deletePriceAlert(priceAlert.alertId, {
      onSuccess: () => {
        setAlertModal(null);
        setToastMessage('가격 알림이 해제되었습니다.');
      },
      onError: (deleteError) => setToastMessage(getApiErrorMessage(deleteError)),
    });
  };

  const handleToastHide = useCallback(() => setToastMessage(null), []);

  // 주문은 로그인 상태에서만 가능합니다. (화면설계서 USR-MARKET-02-M02)
  const handleOrderPress = async (side: OrderSide) => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }
    // 주문 규칙·사용 가능 포인트·매도 가능 수량을 최신 값으로 다시 조회합니다. 이미 불러온 값이 있으면 먼저 열고 갱신합니다.
    const refetchPromise = refetchOrderAvailability();
    const availability = orderAvailability ?? (await refetchPromise).data;
    if (!availability) {
      setToastMessage('주문 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
      return;
    }
    if (!availability.isTradable) {
      setToastMessage('지금은 거래할 수 없는 상품이에요.');
      return;
    }
    setOrderSide(side);
  };

  // 관심 상품은 회원만 등록할 수 있습니다.
  const handleFavoritePress = () => {
    if (!product) return;
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }
    toggleWishlist({ stockId: product.id, isWishlisted: product.isFavorite });
  };

  const handleLoginPress = () => {
    setIsLoginModalVisible(false);
    router.push('/login');
  };

  const handleOrderHistoryPress = () => {
    setOrderSide(null);
    router.push('/transactions');
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-motu-bg">
        <ProductDetailHeader
          isFavorite={false}
          onBack={handleBack}
          onAlertPress={handleAlertPress}
          onFavoritePress={() => {}}
        />
        <ActivityIndicator className="pt-20" />
      </SafeAreaView>
    );
  }

  if (!product) {
    // 404는 없는 상품이고, 그 밖의 오류는 다시 시도하도록 안내합니다.
    const isNotFound = !error || (isAxiosError(error) && error.response?.status === 404);

    return (
      <SafeAreaView className="flex-1 bg-motu-bg">
        <ProductDetailHeader
          isFavorite={false}
          onBack={handleBack}
          onAlertPress={handleAlertPress}
          onFavoritePress={() => {}}
        />
        <Text className="pt-20 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
          {isNotFound
            ? '상품 정보를 찾을 수 없습니다.'
            : '상품 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'}
        </Text>
      </SafeAreaView>
    );
  }

  // 차트 영역은 봉이 없을 때도 같은 높이를 유지합니다.
  const renderChart = () => {
    const candles = candlesQuery.data ?? [];

    if (candlesQuery.isPending) {
      return <ActivityIndicator className="h-[274px]" />;
    }

    if (candles.length === 0) {
      return (
        <View className="h-[274px] items-center justify-center">
          <Text className="text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
            {candlesQuery.isError
              ? '차트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
              : '체결 내역이 없어 차트를 표시할 수 없어요.'}
          </Text>
        </View>
      );
    }

    return (
      <PriceChart
        candles={candles}
        currentPrice={tradeSummary?.currentPrice ?? product.price}
        period={period}
      />
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-motu-bg">
      <ProductDetailHeader
        isFavorite={product.isFavorite}
        hasAlert={alertPrice !== null}
        isScrolled={isScrolled}
        onBack={handleBack}
        onAlertPress={handleAlertPress}
        onFavoritePress={handleFavoritePress}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
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
                {renderChart()}
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
              {tradeSummary && <TradeSummaryCard summary={tradeSummary} />}
            </View>
          </>
        ) : selectedTab === 'orderBook' ? (
          <>
            {orderBook && tradeSummary && (
              <View className="px-6 pt-4">
                <OrderBookCard
                  orderBook={orderBook}
                  currentPrice={tradeSummary.currentPrice}
                  changeAmount={tradeSummary.changeAmount}
                  changeRate={tradeSummary.changeRate}
                />
              </View>
            )}
            <View className="px-6 pb-8 pt-5">
              <RecentTradeList trades={recentTrades} />
            </View>
          </>
        ) : (
          <View className="px-6 pb-8 pt-4">
            <ProductInfoTable
              info={product.info}
              category={product.category}
              tradeStatus={product.tradeStatus}
            />
          </View>
        )}
      </ScrollView>

      <View pointerEvents="none" className="absolute inset-x-0 bottom-[104px]">
        <Toast message={toastMessage} onHide={handleToastHide} />
      </View>

      <OrderButtons
        onSellPress={() => void handleOrderPress('sell')}
        onBuyPress={() => void handleOrderPress('buy')}
      />

      {orderSide && orderAvailability && (
        <OrderSheet
          key={orderSide}
          side={orderSide}
          stockId={stockId}
          productName={product.name}
          currentPrice={tradeSummary?.currentPrice ?? product.price}
          changeRate={tradeSummary?.changeRate ?? product.changeRate}
          availability={orderAvailability}
          onClose={() => setOrderSide(null)}
          onHistoryPress={handleOrderHistoryPress}
        />
      )}
      <LoginRequiredModal
        isVisible={isLoginModalVisible}
        onClose={() => setIsLoginModalVisible(false)}
        onLoginPress={handleLoginPress}
      />

      <PriceAlertModal
        isVisible={alertModal === 'form'}
        currentPrice={tradeSummary?.currentPrice ?? product.price}
        changeRate={tradeSummary?.changeRate ?? product.changeRate}
        alertPrice={alertPrice}
        onClose={handleAlertModalClose}
        onSubmit={handleAlertSubmit}
        onReleasePress={() => setAlertModal('release')}
      />
      {alertPrice !== null && (
        <PriceAlertReleaseModal
          isVisible={alertModal === 'release'}
          productName={product.name}
          alertPrice={alertPrice}
          onClose={handleAlertModalClose}
          onCancel={() => setAlertModal('form')}
          onRelease={handleAlertRelease}
        />
      )}
    </SafeAreaView>
  );
}
