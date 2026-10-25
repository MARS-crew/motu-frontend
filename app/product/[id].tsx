import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
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
import {
  CHART_PERIOD_OPTIONS,
  getOrderBook,
  getProductCandles,
  getRecentTrades,
  getTickSize,
  getTradeSummary,
} from '@/constants/productDetailPreview';
import { SELLABLE_QUANTITY } from '@/constants/orderPreview';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { useMyAccountQuery } from '@/queries/useMyAccountQuery';
import { useStockDetailQuery } from '@/queries/useStockDetailQuery';
import { useWishlistMutation } from '@/queries/useWishlistMutation';
import { useAuthStore } from '@/stores/useAuthStore';
import type { OrderSide } from '@/types/order';
import type { ChartPeriod } from '@/types/product';

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
  const { data: account, refetch: refetchAccount } = useMyAccountQuery();

  const [selectedTab, setSelectedTab] = useState<DetailTab>('chart');
  const [period, setPeriod] = useState<ChartPeriod>('day');
  // 지정가 알림은 서버 연동 전까지 화면 안에서만 유지합니다.
  const [alertPrice, setAlertPrice] = useState<number | null>(null);
  const [alertModal, setAlertModal] = useState<'form' | 'release' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [orderSide, setOrderSide] = useState<OrderSide | null>(null);
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
  const { isScrolled, handleScroll } = useHeaderScroll();

  const candles = useMemo(
    () => (product ? getProductCandles(product, period) : []),
    [product, period],
  );
  const orderBook = useMemo(() => (product ? getOrderBook(product) : undefined), [product]);
  const recentTrades = useMemo(() => (product ? getRecentTrades(product) : []), [product]);
  // 거래 요약은 시세 API가 나오기 전까지 미리보기 데이터로 보여줍니다.
  const tradeSummary = useMemo(() => (product ? getTradeSummary(product) : undefined), [product]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/market');
    }
  };

  const handleAlertPress = () => setAlertModal('form');

  const handleAlertModalClose = () => setAlertModal(null);

  const handleAlertSubmit = (price: number) => {
    setAlertPrice(price);
    setAlertModal(null);
  };

  // 해제를 취소하면 수정 모달로 돌아갑니다. (화면설계서 USR-MARKET-02-M01)
  const handleAlertRelease = () => {
    setAlertPrice(null);
    setAlertModal(null);
    setToastMessage('가격 알림이 해제되었습니다.');
  };

  const handleToastHide = useCallback(() => setToastMessage(null), []);

  // 주문은 로그인 상태에서만 가능합니다. (화면설계서 USR-MARKET-02-M02)
  const handleOrderPress = async (side: OrderSide) => {
    if (!isLoggedIn) {
      setIsLoginModalVisible(true);
      return;
    }
    // 매수는 사용 가능 포인트를 최신 값으로 다시 조회합니다. 이미 불러온 값이 있으면 먼저 열고 갱신합니다.
    if (side === 'buy') {
      const refetchPromise = refetchAccount();
      if (!account) {
        const { data } = await refetchPromise;
        if (!data) {
          setToastMessage('주문 가능 포인트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.');
          return;
        }
      }
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
              {tradeSummary && <TradeSummaryCard summary={tradeSummary} />}
            </View>
          </>
        ) : selectedTab === 'orderBook' ? (
          <>
            {orderBook && (
              <View className="px-6 pt-4">
                <OrderBookCard
                  orderBook={orderBook}
                  currentPrice={product.price}
                  changeRate={product.changeRate}
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

      {orderSide && (
        <OrderSheet
          key={orderSide}
          side={orderSide}
          productName={product.name}
          currentPrice={product.price}
          changeRate={product.changeRate}
          tickSize={getTickSize(product.price)}
          availablePoints={account?.availableCash ?? 0}
          sellableQuantity={SELLABLE_QUANTITY}
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
        currentPrice={product.price}
        changeRate={product.changeRate}
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
