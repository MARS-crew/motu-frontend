import { ActivityIndicator, View } from 'react-native';

import { HomeEmptyBox } from '@/components/home/HomeEmptyBox';
import { StockListItem } from '@/components/home/StockListItem';
import type { StockSummary } from '@/types/home';

type HomeStockListProps = {
  stocks: StockSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  emptyMessage: string;
  onStockPress: (stockId: number) => void;
};

// 홈 섹션의 종목 목록을 조회 상태(로딩/오류/빈 목록)에 맞춰 표시합니다.
export function HomeStockList({
  stocks,
  isLoading,
  isError,
  emptyMessage,
  onStockPress,
}: HomeStockListProps) {
  if (isLoading) {
    return (
      <View className="items-center justify-center py-6">
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return <HomeEmptyBox message="정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요." />;
  }

  if (!stocks || stocks.length === 0) {
    return <HomeEmptyBox message={emptyMessage} />;
  }

  return (
    <View className="gap-2">
      {stocks.map((stock) => (
        <StockListItem key={stock.id} stock={stock} onPress={() => onStockPress(stock.id)} />
      ))}
    </View>
  );
}
