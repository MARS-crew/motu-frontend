import { Image } from 'expo-image';
import { router } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Pagination } from '@/components/Pagination';
import { SortDropdown } from '@/components/SortDropdown';
import { TransactionDatePicker } from '@/components/transactions/TransactionDatePicker';
import { TRANSACTION_PREVIEW, TRANSACTION_SORT_OPTIONS } from '@/constants/transactionPreview';
import { formatDateRange, type TransactionDateRange } from '@/utils/transactionDate';

cssInterop(Image, { className: 'style' });

const TABS = ['거래내역', '체결주문', '미체결주문'] as const;
const PAGE_SIZE = 10;
const INITIAL_DATE_RANGE = { start: '2026-09-05', end: '2026-09-06' };

export default function TransactionsScreen() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('거래내역');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortValue, setSortValue] = useState(TRANSACTION_SORT_OPTIONS[0].value);
  const [dateRange, setDateRange] = useState<TransactionDateRange>(INITIAL_DATE_RANGE);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const transactions = TRANSACTION_PREVIEW.filter(({ tradedAt }) => {
    const date = tradedAt.slice(0, 10);
    return date >= dateRange.start && date <= dateRange.end;
  }).sort((left, right) =>
    sortValue === 'amount'
      ? right.amount - left.amount || right.tradedAt.localeCompare(left.tradedAt)
      : right.tradedAt.localeCompare(left.tradedAt),
  );
  const buyAmount = transactions.reduce(
    (total, item) => total + (item.side === 'buy' ? item.amount : 0),
    0,
  );
  const sellAmount = transactions.reduce(
    (total, item) => total + (item.side === 'sell' ? item.amount : 0),
    0,
  );
  const hasTransactions = activeTab !== '미체결주문' && transactions.length > 0;
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE);
  const pageTransactions = transactions.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
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
    setIsCalendarOpen(false);
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} className="flex-1 bg-motu-bg">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-6">
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
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
          {hasTransactions ? (
            <>
              <View className="mb-4 h-[77px] flex-row items-center justify-between gap-2 rounded-xl border border-motu-grey-lighter bg-white px-4 py-4">
                <View>
                  <Text className="font-pretendard text-xs text-motu-grey">총 거래금액</Text>
                  <Text className="mt-1.5 font-pretendard-bold text-lg text-motu-black">
                    {(buyAmount + sellAmount).toLocaleString('ko-KR')} P
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
              <Pagination
                currentPage={currentPage}
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
                조회 가능한 미체결 주문이 없습니다.
              </Text>
              <Text className="mt-3 text-center font-pretendard text-xs leading-5 text-motu-grey">
                마켓에서 주문하면 체결 전 주문이 여기에 표시됩니다.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
