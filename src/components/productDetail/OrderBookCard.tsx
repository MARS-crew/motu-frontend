import { Text, View } from 'react-native';

import type { OrderBook, OrderBookLevel } from '@/types/product';
import { getChangeColorClass } from '@/utils/formatNumber';

type OrderBookCardProps = {
  orderBook: OrderBook;
  currentPrice: number;
  changeAmount: number;
  changeRate: number;
};

type OrderBookSide = 'ask' | 'bid';

type OrderBookColumnProps = {
  side: OrderBookSide;
  levels: OrderBookLevel[];
};

// 화면설계서 기준 매도·매수 호가를 각각 최대 5단계까지 표시합니다.
const MAX_ORDER_BOOK_DEPTH = 5;

const formatNumber = (value: number) => value.toLocaleString('ko-KR');

function OrderBookColumn({ side, levels }: OrderBookColumnProps) {
  const isAsk = side === 'ask';
  const headerLabels = isAsk ? ['가격(P)', '잔량(주)'] : ['잔량(주)', '가격(P)'];

  return (
    <View className="flex-1">
      <View className="flex-row justify-between border-b border-motu-grey-lighter px-2 pb-[7px]">
        {headerLabels.map((label) => (
          <Text
            key={label}
            className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey-light"
          >
            {label}
          </Text>
        ))}
      </View>
      {levels.length === 0 && (
        <Text className="py-[11px] text-center font-pretendard-medium text-[11px] leading-[14px] text-motu-grey-light">
          호가 없음
        </Text>
      )}
      {levels.map((level, index) => {
        const price = (
          <Text
            className={`font-pretendard-semibold text-[11px] leading-[14px] ${
              isAsk ? 'text-motu-blue' : 'text-motu-red'
            }`}
          >
            {formatNumber(level.price)}
          </Text>
        );
        const quantity = (
          <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
            {formatNumber(level.quantity)}
          </Text>
        );

        return (
          <View
            key={level.price}
            className={`flex-row items-center justify-between px-2 py-[11px] ${
              index > 0 ? 'border-t border-motu-grey-lighter' : ''
            }`}
          >
            {isAsk ? price : quantity}
            {isAsk ? quantity : price}
          </View>
        );
      })}
    </View>
  );
}

export function OrderBookCard({
  orderBook,
  currentPrice,
  changeAmount,
  changeRate,
}: OrderBookCardProps) {
  // 매도는 낮은 가격, 매수는 높은 가격부터 5단계를 고르고 둘 다 높은 가격이 위로 오게 표시합니다.
  const asks = [...orderBook.asks]
    .sort((a, b) => a.price - b.price)
    .slice(0, MAX_ORDER_BOOK_DEPTH)
    .reverse();
  const bids = [...orderBook.bids].sort((a, b) => b.price - a.price).slice(0, MAX_ORDER_BOOK_DEPTH);

  const changeSign = changeAmount > 0 ? '+' : changeAmount < 0 ? '-' : '';

  return (
    <View className="rounded-xl border border-motu-grey-lighter bg-white px-[13px] py-[17px]">
      <View className="flex-row gap-1.5">
        <Text className="flex-1 px-2 font-pretendard-semibold text-[11px] leading-[14px] text-motu-blue">
          매도 호가
        </Text>
        <Text className="w-[84px] text-center font-pretendard-semibold text-[11px] leading-[14px] text-motu-grey">
          현재가
        </Text>
        <Text className="flex-1 px-2 text-right font-pretendard-semibold text-[11px] leading-[14px] text-motu-red">
          매수 호가
        </Text>
      </View>

      <View className="mt-2.5 flex-row gap-1.5">
        <OrderBookColumn side="ask" levels={asks} />
        <View className="w-[84px] items-center justify-center gap-1">
          <Text className="font-pretendard-bold text-lg leading-6 text-motu-black">
            {formatNumber(currentPrice)}
          </Text>
          <Text
            className={`text-center font-pretendard-semibold text-[11px] leading-[14px] ${getChangeColorClass(
              changeAmount,
            )}`}
          >
            {`${changeSign}${formatNumber(Math.abs(changeAmount))} (${Math.abs(changeRate).toFixed(2)}%)`}
          </Text>
        </View>
        <OrderBookColumn side="bid" levels={bids} />
      </View>
    </View>
  );
}
