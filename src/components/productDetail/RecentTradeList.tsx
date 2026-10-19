import { Text, View } from 'react-native';

import type { RecentTrade } from '@/types/product';

type RecentTradeListProps = {
  trades: RecentTrade[];
};

// 화면설계서 기준 최신순 5개까지 표시합니다.
const MAX_RECENT_TRADE_COUNT = 5;

export function RecentTradeList({ trades }: RecentTradeListProps) {
  const visibleTrades = trades.slice(0, MAX_RECENT_TRADE_COUNT);

  return (
    <View>
      <Text className="font-pretendard-bold text-[13px] leading-[18px] text-motu-black">
        최근 체결 내역
      </Text>
      <View className="mt-2 overflow-hidden rounded-xl border border-motu-grey-lighter bg-white">
        <View className="flex-row gap-2 bg-motu-grey-lighter/40 px-3 py-2">
          <Text className="flex-1 font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
            체결시간
          </Text>
          <Text className="flex-1 text-right font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
            체결가
          </Text>
          <Text className="flex-1 text-right font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
            체결량
          </Text>
        </View>
        {visibleTrades.length === 0 ? (
          <Text className="py-6 text-center font-pretendard-medium text-xs leading-4 text-motu-grey">
            체결 내역이 없습니다.
          </Text>
        ) : (
          visibleTrades.map((trade, index) => (
            <View
              key={trade.id}
              className={`flex-row gap-2 px-3 py-[9px] ${
                index > 0 ? 'border-t border-motu-grey-lighter' : ''
              }`}
            >
              <Text className="flex-1 font-pretendard-medium text-xs leading-4 text-motu-grey">
                {trade.time}
              </Text>
              {/* 매도 체결은 파랑, 매수 체결은 빨강으로 표시합니다. */}
              <Text
                className={`flex-1 text-right font-pretendard-medium text-xs leading-4 ${
                  trade.side === 'sell' ? 'text-motu-blue' : 'text-motu-red'
                }`}
              >
                {trade.price.toLocaleString('ko-KR')}
              </Text>
              <Text className="flex-1 text-right font-pretendard-medium text-xs leading-4 text-motu-black">
                {trade.quantity.toLocaleString('ko-KR')}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
