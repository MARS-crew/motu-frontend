import { Text, View } from 'react-native';

import type { TradeSummary } from '@/types/product';
import { formatPoint } from '@/utils/formatNumber';

type TradeSummaryCardProps = {
  summary: TradeSummary;
};

type SummaryItemProps = {
  label: string;
  value: string;
};

// 오늘 체결이 없어 값이 없으면 '-'로 표시합니다.
const formatSummaryPrice = (value: number | null) => (value === null ? '-' : formatPoint(value));

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <View className="flex-1 items-center gap-1">
      <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
        {label}
      </Text>
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">{value}</Text>
    </View>
  );
}

export function TradeSummaryCard({ summary }: TradeSummaryCardProps) {
  return (
    <View>
      <Text className="font-pretendard-bold text-[13px] leading-[18px] text-motu-black">
        거래 정보 요약
      </Text>
      <View className="mt-2 rounded-xl border border-motu-grey-lighter bg-white px-[13px] py-[17px]">
        <View className="flex-row gap-1">
          <SummaryItem label="시가" value={formatSummaryPrice(summary.open)} />
          <SummaryItem label="고가" value={formatSummaryPrice(summary.high)} />
          <SummaryItem label="저가" value={formatSummaryPrice(summary.low)} />
          <SummaryItem label="종가" value={formatPoint(summary.close)} />
        </View>
        <View className="mt-4 flex-row gap-3 border-t border-motu-grey-lighter pt-[17px]">
          <View className="flex-1 items-center gap-1.5">
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
              거래량
            </Text>
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
              {`${summary.volume.toLocaleString('ko-KR')} 주`}
            </Text>
          </View>
          <View className="flex-1 items-center gap-1.5 border-l border-motu-grey-lighter">
            <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
              거래대금
            </Text>
            <Text className="font-pretendard-medium text-xs leading-4 text-motu-black">
              {formatPoint(summary.tradeAmount)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
