import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pagination } from '@/components/Pagination';
import { SortDropdown } from '@/components/SortDropdown';
import { CancelOrderModal } from '@/components/transactions/CancelOrderModal';
import { TransactionDatePicker } from '@/components/transactions/TransactionDatePicker';
import { TRANSACTION_SORT_OPTIONS } from '@/constants/transactionPreview';
import { useTradeHistoriesQuery } from '@/queries/useTradeHistoriesQuery';
import {
  getInitialTradeHistoryRange,
  toTradeHistoryParams,
  toTradeHistoryRow,
  toFilledOrderRow,
} from '@/utils/tradeHistory';
import { getApiErrorMessage } from '@/utils/apiError';
import { useHeaderScroll } from '@/hooks/useHeaderScroll';
import { PENDING_ORDER_PREVIEW, type PendingOrderPreview } from '@/constants/pendingOrderPreview';
import { formatDateRange, type TransactionDateRange } from '@/utils/transactionDate';

cssInterop(Image, { className: 'style' });

const TABS = ['거래내역', '체결주문', '미체결주문'] as const;
const EMPTY_STATE_CONTENT = {
  거래내역: {
    title: '조회 가능한 거래내역이 없습니다.',
    description: '마켓에서 주문하면 거래내역이 여기에 표시됩니다.',
  },
  체결주문: {
    title: '조회 가능한 체결 주문이 없습니다.',
    description: '주문이 체결되면 체결 내역이 여기에 표시됩니다.',
  },
  미체결주문: {
    title: '조회 가능한 미체결 주문이 없습니다.',
    description: '마켓에서 주문하면 체결 전 주문이 여기에 표시됩니다.',
  },
};
const PAGE_SIZE = 10;

export default function TransactionsScreen() {
  const { isScrolled, handleScroll } = useHeaderScroll();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('거래내역');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState(TRANSACTION_SORT_OPTIONS[0].value);
  const [dateRange, setDateRange] = useState<TransactionDateRange>(getInitialTradeHistoryRange);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [cancelledOrderIds, setCancelledOrderIds] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<PendingOrderPreview | null>(null);
  const isPendingTab = activeTab === '미체결주문';
  const pendingOrders = PENDING_ORDER_PREVIEW.filter((order) => {
    const date = order.orderedAt.slice(0, 10);
    return (
      !cancelledOrderIds.includes(order.id) && date >= dateRange.start && date <= dateRange.end
    );
  }).sort((left, right) =>
    sortValue === 'amount'
      ? right.orderPrice * right.quantity - left.orderPrice * left.quantity ||
        right.orderedAt.localeCompare(left.orderedAt)
      : right.orderedAt.localeCompare(left.orderedAt),
  );
  const handleCloseCancelModal = () => setSelectedOrder(null);
  const handleConfirmCancel = () => {
    if (!selectedOrder) return;
    // 서버 연동 전 로컬 목록에서만 취소 처리합니다.
    setCancelledOrderIds((ids) => [...ids, selectedOrder.id]);
    setSelectedOrder(null);
  };

  const isHistoryTab = activeTab === '거래내역';
  const isCompletedTab = activeTab === '체결주문';
  const { historyQuery, filledOrdersQuery, summaryQuery, isLoggedIn } = useTradeHistoriesQuery(
    toTradeHistoryParams(dateRange, currentPage, PAGE_SIZE, sortValue),
    isHistoryTab,
    isCompletedTab,
  );
  const listQuery = isCompletedTab ? filledOrdersQuery : historyQuery;
  const history = listQuery.data;
  const summary = summaryQuery.data;
  const historyError = !isPendingTab
    ? !isLoggedIn
      ? `로그인 후 ${activeTab}을 확인해 주세요.`
      : listQuery.isError
        ? getApiErrorMessage(listQuery.error)
        : summaryQuery.isError
          ? getApiErrorMessage(summaryQuery.error)
          : null
    : null;
  const isLoadingHistory = !isPendingTab && !historyError && (!history || !summary);
  const handleRetryHistory = () => {
    void Promise.all([listQuery.refetch(), summaryQuery.refetch()]);
  };
  const buyAmount = summary?.buyAmount ?? 0;
  const sellAmount = summary?.sellAmount ?? 0;
  const totalAmount = summary?.totalAmount ?? 0;
  const pageTransactions: (
    ReturnType<typeof toTradeHistoryRow> | ReturnType<typeof toFilledOrderRow>
  )[] = isCompletedTab
    ? (filledOrdersQuery.data?.items.map(toFilledOrderRow) ?? [])
    : (historyQuery.data?.items.map(toTradeHistoryRow) ?? []);
  const hasTransactions = !isPendingTab && pageTransactions.length > 0;
  const totalPages = Math.ceil((history?.totalCount ?? 0) / (history?.size ?? PAGE_SIZE));
  const handleApplyDateRange = (range: TransactionDateRange) => {
    setDateRange(range);
    setCurrentPage(1);
    setIsCalendarOpen(false);
  };
  const handleSortChange = (value: string) => {
    setSortValue(value);
    setCurrentPage(1);
  };
  const handleTabPress = (tab: (typeof TABS)[number]) => {
    setActiveTab(tab);
    setCurrentPage(1);
    if (tab === '미체결주문') {
      setDateRange({ start: '2026-09-01', end: '2026-09-06' });
      setSortValue('amount');
    } else {
      setDateRange(getInitialTradeHistoryRange());
      setSortValue('latest');
    }
    setIsCalendarOpen(false);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-motu-bg">
      <View
        className={`flex-row items-center justify-between border-b bg-motu-bg px-6 pb-4 pt-6 ${
          isScrolled ? 'border-motu-grey-lighter' : 'border-transparent'
        }`}
      >
        <Text accessibilityRole="header" className="font-pretendard-bold text-lg text-motu-black">
          거래내역
        </Text>
        <View className="flex-row gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="검색"
            onPress={() => router.push('/search')}
            className="h-9 w-9 items-center justify-center active:opacity-60"
          >
            <Image
              source={require('../../assets/icons/home/search.svg')}
              contentFit="contain"
              className="h-[21px] w-[21px]"
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="관심 목록"
            onPress={() => router.push('/favorites')}
            className="h-9 w-9 items-center justify-center active:opacity-60"
          >
            <Image
              source={require('../../assets/icons/home/heart.svg')}
              contentFit="contain"
              className="h-[21px] w-[21px]"
            />
          </Pressable>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          accessibilityRole="tablist"
          className="mx-6 mb-4 flex-row rounded-full border border-motu-grey-lighter bg-white p-1"
        >
          {TABS.map((tab) => (
            <Pressable
              key={tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
              onPress={() => handleTabPress(tab)}
              className={`min-h-11 flex-1 items-center justify-center rounded-full px-1 py-[5px] ${activeTab === tab ? 'bg-motu-black' : ''}`}
            >
              <Text
                className={`font-pretendard-bold text-xs ${activeTab === tab ? 'text-white' : 'text-motu-grey'}`}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>
        <View className="px-6">
          <View className="z-20 mb-4 flex-row gap-2">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`조회 기간 ${formatDateRange(dateRange)}`}
              accessibilityState={{ expanded: isCalendarOpen }}
              onPress={() => setIsCalendarOpen((value) => !value)}
              className={`h-[41.5px] flex-1 flex-row items-center justify-between gap-3 rounded-lg border px-[17px] ${isCalendarOpen ? 'border-motu-black bg-motu-grey-lighter' : 'border-motu-grey-lighter bg-white'}`}
            >
              <Text className="flex-1 text-center font-pretendard-medium text-[13px] text-motu-black">
                {formatDateRange(dateRange)}
              </Text>
              <Image
                source={
                  isCalendarOpen
                    ? require('../../assets/icons/transaction/calendarBlack.svg')
                    : require('../../assets/icons/search/search.svg')
                }
                contentFit="contain"
                className="h-[17px] w-[17px]"
              />
            </Pressable>
            <SortDropdown
              options={TRANSACTION_SORT_OPTIONS}
              value={sortValue}
              onValueChange={handleSortChange}
            />
          </View>
          {isCalendarOpen && (
            <View className="mb-4">
              <TransactionDatePicker value={dateRange} onApply={handleApplyDateRange} />
            </View>
          )}
          {historyError || isLoadingHistory ? (
            <View className="items-center gap-3 px-1 pb-10 pt-[104px]">
              <Text
                accessibilityLiveRegion="polite"
                className="text-center font-pretendard text-xs leading-5 text-motu-grey"
              >
                {historyError || `${activeTab}을 불러오고 있습니다.`}
              </Text>
              {historyError && isLoggedIn && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${activeTab} 다시 조회`}
                  onPress={handleRetryHistory}
                  disabled={listQuery.isFetching || summaryQuery.isFetching}
                >
                  <Text className="font-pretendard-medium text-xs text-motu-grey underline">
                    다시 조회
                  </Text>
                </Pressable>
              )}
            </View>
          ) : isPendingTab && pendingOrders.length > 0 ? (
            <View className="gap-3 pb-6">
              {pendingOrders.map((order) => (
                <View
                  key={order.id}
                  className="rounded-xl border border-motu-grey-lighter bg-white p-4"
                >
                  <View className="flex-row items-center gap-2.5">
                    <View
                      className={`h-9 w-9 items-center justify-center rounded-full ${order.badgeClassName}`}
                    >
                      <Text className="font-pretendard-bold text-sm text-white">
                        {order.productName[0]}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-pretendard-bold text-[13px] text-motu-black">
                        {order.productName}
                      </Text>
                      <Text className="mt-0.5 font-pretendard text-[11px] text-motu-grey">
                        {order.orderedAt.slice(5, 10).replace('-', '.')} {order.orderedAt.slice(11)}
                      </Text>
                    </View>
                    <Text
                      className={`font-pretendard-bold text-[11px] ${order.side === 'buy' ? 'text-motu-red' : 'text-motu-blue'}`}
                    >
                      {order.side === 'buy' ? '매수' : '매도'}
                    </Text>
                  </View>
                  <View className="my-3 h-px bg-motu-grey-lighter" />
                  <View className="flex-row gap-1">
                    <View className="flex-1">
                      <Text className="font-pretendard text-[10px] text-motu-grey">주문가격</Text>
                      <Text className="mt-0.5 font-pretendard-semibold text-sm text-motu-black">
                        {order.orderPrice.toLocaleString('ko-KR')} P
                      </Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Text className="font-pretendard text-[10px] text-motu-grey">주문수량</Text>
                      <Text className="mt-0.5 font-pretendard-semibold text-sm text-motu-black">
                        {order.quantity}주
                      </Text>
                    </View>
                    <View className="flex-1 items-center">
                      <Text className="font-pretendard text-[10px] text-motu-grey">미체결수량</Text>
                      <Text className="mt-0.5 font-pretendard-semibold text-sm text-motu-black">
                        {order.remainingQuantity}주
                      </Text>
                    </View>
                    <View className="flex-1 items-end">
                      <Text className="font-pretendard text-[10px] text-motu-grey">주문금액</Text>
                      <Text className="mt-0.5 font-pretendard-semibold text-sm text-motu-black">
                        {(order.orderPrice * order.quantity).toLocaleString('ko-KR')} P
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`${order.productName} 주문 취소`}
                    onPress={() => setSelectedOrder(order)}
                    className="mt-3 min-h-9 items-center justify-center rounded-lg border border-motu-grey-lighter py-2 active:opacity-60"
                  >
                    <Text className="font-pretendard-bold text-sm text-motu-grey">주문 취소</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : hasTransactions ? (
            <>
              <View className="mb-4 h-[77px] flex-row items-center justify-between gap-2 rounded-xl border border-motu-grey-lighter bg-white px-4 py-4">
                <View>
                  <Text className="font-pretendard text-xs text-motu-grey">총 거래금액</Text>
                  <Text className="mt-1.5 font-pretendard-bold text-lg text-motu-black">
                    {totalAmount.toLocaleString('ko-KR')} P
                  </Text>
                </View>
                <View className="gap-1.5">
                  <Text className="text-right font-pretendard text-[11px] text-motu-grey">
                    매수{' '}
                    <Text className="font-pretendard-bold text-xs text-motu-red">
                      {buyAmount.toLocaleString('ko-KR')} P
                    </Text>
                  </Text>
                  <Text className="text-right font-pretendard text-[11px] text-motu-grey">
                    매도{' '}
                    <Text className="font-pretendard-bold text-xs text-motu-blue">
                      {sellAmount.toLocaleString('ko-KR')} P
                    </Text>
                  </Text>
                </View>
              </View>
              {isCompletedTab ? (
                <View className="overflow-hidden rounded-xl border border-motu-grey-lighter bg-white">
                  <View className="flex-row bg-motu-grey-lighter/60 px-3 py-2">
                    <Text className="w-[22%] font-pretendard-semibold text-[9px] text-motu-grey">
                      거래일시
                    </Text>
                    <Text className="w-[19%] font-pretendard-semibold text-[9px] text-motu-grey">
                      상품명
                    </Text>
                    <Text className="w-[9%] text-center font-pretendard-semibold text-[9px] text-motu-grey">
                      구분
                    </Text>
                    <Text className="w-[16%] text-right font-pretendard-semibold text-[9px] text-motu-grey">
                      주문가격(P)
                    </Text>
                    <Text className="w-[12%] text-right font-pretendard-semibold text-[9px] text-motu-grey">
                      체결수량
                    </Text>
                    <Text className="w-[22%] text-right font-pretendard-semibold text-[9px] text-motu-grey">
                      체결금액(P)
                    </Text>
                  </View>
                  {pageTransactions.map((item, index) => (
                    <View
                      key={item.id}
                      className={`min-h-[52.5px] flex-row items-center px-3 py-3 ${index > 0 ? 'border-t border-motu-grey-lighter' : ''}`}
                    >
                      <Text className="w-[22%] font-pretendard text-[10px] text-motu-grey">
                        {item.tradedAt.slice(5, 10).replace('-', '.')} {item.tradedAt.slice(11)}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="w-[19%] pr-1 font-pretendard-semibold text-xs text-motu-black"
                      >
                        {item.productName}
                      </Text>
                      <Text
                        className={`w-[9%] text-center font-pretendard-bold text-[10px] ${item.side === 'buy' ? 'text-motu-red' : 'text-motu-blue'}`}
                      >
                        {item.side === 'buy' ? '매수' : '매도'}
                      </Text>
                      <Text className="w-[16%] text-right font-pretendard text-[11px] text-motu-black">
                        {'orderPrice' in item ? item.orderPrice.toLocaleString('ko-KR') : ''}
                      </Text>
                      <Text className="w-[12%] text-right font-pretendard text-[11px] text-motu-grey">
                        {'filledQuantity' in item
                          ? item.filledQuantity.toLocaleString('ko-KR')
                          : ''}
                      </Text>
                      <Text className="w-[22%] text-right font-pretendard-semibold text-[11px] text-motu-black">
                        {item.amount.toLocaleString('ko-KR')}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="overflow-hidden rounded-xl border border-motu-grey-lighter bg-white">
                  <View className="flex-row bg-motu-grey-lighter/60 px-3 py-2">
                    <Text className="w-[28%] font-pretendard-semibold text-[10px] text-motu-grey">
                      거래일시
                    </Text>
                    <Text className="w-[28%] font-pretendard-semibold text-[10px] text-motu-grey">
                      상품명
                    </Text>
                    <Text className="w-[14%] text-center font-pretendard-semibold text-[10px] text-motu-grey">
                      구분
                    </Text>
                    <Text className="w-[30%] text-right font-pretendard-semibold text-[10px] text-motu-grey">
                      거래금액(P)
                    </Text>
                  </View>
                  {pageTransactions.map((item, index) => (
                    <View
                      key={item.id}
                      className={`min-h-[52.5px] flex-row items-center px-3 py-3 ${index > 0 ? 'border-t border-motu-grey-lighter' : ''}`}
                    >
                      <Text className="w-[28%] font-pretendard text-[11px] text-motu-grey">
                        {item.tradedAt.slice(5, 10).replace('-', '.')} {item.tradedAt.slice(11)}
                      </Text>
                      <Text
                        numberOfLines={1}
                        className="w-[28%] pr-2 font-pretendard-semibold text-xs text-motu-black"
                      >
                        {item.productName}
                      </Text>
                      <Text
                        className={`w-[14%] text-center font-pretendard-bold text-[11px] ${item.side === 'buy' ? 'text-motu-red' : 'text-motu-blue'}`}
                      >
                        {item.side === 'buy' ? '매수' : '매도'}
                      </Text>
                      <Text className="w-[30%] text-right font-pretendard-semibold text-[11px] text-motu-black">
                        {item.amount.toLocaleString('ko-KR')} P
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              <Pagination
                currentPage={history?.page ?? currentPage}
                totalPages={totalPages}
                visiblePageCount={3}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <View className="items-center px-1 pb-10 pt-[104px]">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-motu-grey-lighter/60">
                <Image
                  source={require('../../assets/icons/tabBar/transactionsInactive.svg')}
                  contentFit="contain"
                  className="h-6 w-6"
                />
              </View>
              <Text className="mt-3 text-center font-pretendard-semibold text-[13px] text-motu-black">
                {EMPTY_STATE_CONTENT[activeTab].title}
              </Text>
              <Text className="mt-3 text-center font-pretendard text-xs leading-5 text-motu-grey">
                {EMPTY_STATE_CONTENT[activeTab].description}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
      <CancelOrderModal
        order={selectedOrder}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
      />
    </SafeAreaView>
  );
}
