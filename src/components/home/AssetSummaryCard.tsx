import { router } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { HomeEmptyBox } from '@/components/home/HomeEmptyBox';
import { LoginRequiredBox } from '@/components/home/LoginRequiredBox';
import type { AssetSummary } from '@/types/home';
import {
  formatPoint,
  formatRate,
  formatSignedPoint,
  getChangeColorClass,
} from '@/utils/formatNumber';

type AssetSummaryCardProps = {
  summary: AssetSummary | undefined;
  isLoggedIn: boolean;
  isLoading: boolean;
  isError: boolean;
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

// 비회원·로딩·오류일 때는 카드 제목 아래에 상태 안내를 표시합니다.
export function AssetSummaryCard({
  summary,
  isLoggedIn,
  isLoading,
  isError,
}: AssetSummaryCardProps) {
  if (!isLoggedIn || isLoading || !summary) {
    return (
      <View className="rounded-2xl border border-motu-grey-lighter bg-white p-4">
        <Text className="font-pretendard-medium text-xs leading-4 text-motu-grey">총 평가자산</Text>
        <View className="mt-3">
          {!isLoggedIn ? (
            <LoginRequiredBox />
          ) : isLoading ? (
            <View className="items-center justify-center py-6">
              <ActivityIndicator />
            </View>
          ) : (
            <HomeEmptyBox
              message={
                isError
                  ? '정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.'
                  : '총 평가자산 정보가 없습니다.'
              }
            />
          )}
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
        <AssetStat
          label="거래 대금"
          value={summary.tradeAmount === null ? '-' : formatPoint(summary.tradeAmount)}
        />
      </View>
    </Pressable>
  );
}
