import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import type { AssetSummary } from '@/types/home';
import {
  formatPoint,
  formatRate,
  formatSignedPoint,
  getChangeColorClass,
} from '@/utils/formatNumber';

type AssetSummaryCardProps = {
  summary: AssetSummary | null;
};

type AssetStatProps = {
  label: string;
  value: string;
  valueClassName?: string;
};

function AssetStat({ label, value, valueClassName = 'text-motu-black' }: AssetStatProps) {
  return (
    <View className="flex-1">
      <Text className="font-pretendard-medium text-[11px] leading-[14px] text-motu-grey">
        {label}
      </Text>
      <Text className={`mt-1 font-pretendard-medium text-xs leading-4 ${valueClassName}`}>
        {value}
      </Text>
    </View>
  );
}

// summary가 없으면 비회원으로 보고 로그인 안내를 표시합니다.
export function AssetSummaryCard({ summary }: AssetSummaryCardProps) {
  if (!summary) {
    return (
      <View className="rounded-2xl border border-motu-grey-lighter bg-white p-4">
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey">총 평가자산</Text>
        <View className="mt-3">
          <LoginRequiredBox />
        </View>
      </View>
    );
  }

  const handlePress = () => router.navigate('/portfolio');

  return (
    <Pressable
      accessibilityRole="button"
      onPress={handlePress}
      className="rounded-2xl border border-motu-grey-lighter bg-white p-4 active:opacity-80"
    >
      <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey">총 평가자산</Text>
      <View className="mt-1.5 flex-row items-center gap-2">
        <Text className="font-pretendard-bold text-2xl text-motu-black">
          {formatPoint(summary.totalAsset)}
        </Text>
        <Text
          className={`font-pretendard-bold text-[13px] leading-[18px] ${getChangeColorClass(summary.totalReturnRate)}`}
        >
          {formatRate(summary.totalReturnRate)}
        </Text>
      </View>
      <View className="mt-4 flex-row gap-2">
        <AssetStat
          label="평가손익"
          value={formatSignedPoint(summary.profitLoss)}
          valueClassName={getChangeColorClass(summary.profitLoss)}
        />
        <AssetStat label="매입금액" value={formatPoint(summary.purchaseAmount)} />
        <AssetStat label="거래 대금" value={formatPoint(summary.tradeAmount)} />
      </View>
    </Pressable>
  );
}
